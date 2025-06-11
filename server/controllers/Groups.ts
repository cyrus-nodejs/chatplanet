import { pool } from '../models/connectDb'
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '../utils/cloudinary';


// Create Group by User
export const createGroup = async (req: any, res: any) => {
  const { name, description } = req.body;
  const userid = req.user.id;

  if (!req.files || !req.files['image'] || !req.files['image'][0]) {
    return res.status(400).json({ success: false, message: "No image file uploaded" });
  }

  try {
    const imagePath = req.files['image'][0].path;
    const uploadResult :any= await uploadToCloudinary(imagePath, 'chatplanetassets');

    const groupId = uuidv4();
    const imageUrl = uploadResult.secure_url;

    const sql = `
      INSERT INTO groupchat (id, name, description, createdBy, group_image)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [groupId, name, description, userid, imageUrl];

    await pool.query(sql, values);

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group: {
        id: groupId,
        name,
        description,
        createdBy: userid,
        group_image: imageUrl
      }
    });
  } catch (err) {
    console.error("Error creating group:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const addGroupMember = async (req:any, res:any) => {
 
        const {group_id, user_id} = req.body
        console.log(`addgroup member ${req.body}`)
       try {
    const result = await pool.query(
      `
      INSERT INTO group_member (user_id, group_id)
      VALUES ($1, $2)
      `,
      [user_id, group_id]
    );

    if (result.rowCount === 0) {
      return res.status(200).json({ message: 'User is already in the group.' });
    } else {
      return res.status(201).json({ message: 'User added to group.' });
    }

  } catch (error) {
    console.error('Error inserting group member:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
              }


// Retrieve group
export const getGroups = async (req: any, res: any) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No user ID provided',
        });
    }

    console.log("Fetching groups for user:", userId);

    const sqlQuery = `SELECT * FROM groupchat`; // assuming user_id column exists

    try {
        const result = await pool.query(sqlQuery);

        console.log("Groups retrieved:", result.rows);

        return res.status(200).json({
            success: true,
            message: "Groups retrieved successfully",
            groups: result.rows,
        });
    } catch (err) {
        console.error("Error retrieving groups:", err);

        return res.status(500).json({
            success: false,
            message: "Error retrieving groups",
        });
    }
};

export const getGroupMember = async (req: any, res: any) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No user ID provided',
        });
    }

    console.log("Fetching group members for user:", userId);

    const sqlQuery = `SELECT * FROM group_member WHERE user_id = $1`;
    const values = [userId];

    try {
        const result = await pool.query(sqlQuery, values);

        console.log("Group members retrieved:", result.rows);

        return res.status(200).json({
            success: true,
            message: "Group members fetched successfully!",
            groupmembers: result.rows,
        });
    } catch (err) {
        console.error("Error fetching group members:", err);

        return res.status(500).json({
            success: false,
            message: "Error fetching group members",
        });
    }
};