import { pool } from '../models/connectDb'
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '../utils/cloudinary';
import { Response, Request, NextFunction } from 'express'

// Create Group by User
export const createGroup = async (req: any, res: any) => {
  const { name, description } = req.body;
  const userid = req.user?.id;

 if (!req.files || Array.isArray(req.files)) {
res.status(400).json({ success: false, message: "No image file uploaded" });
  return;
}

if (!req.files['image'] || !req.files['image'][0]) {
   res.status(400).json({ success: false, message: "No image file uploaded" });
     return;
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

     res.status(201).json({
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
     res.status(500).json({ success: false, message: "Internal server error" });
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
       res.status(200).json({ message: 'User is already in the group.' });
         return;
    } else {
      res.status(201).json({ message: 'User added to group.' });
        return;
    }

  } catch (error) {
    console.error('Error inserting group member:', error);
     res.status(500).json({ error: 'Internal server error' });
       return;
  }
              }


// Retrieve group
export const getGroups = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
         res.status(401).json({
            success: false,
            message: 'Unauthorized: No user ID provided',
        });
          return;
    }

    console.log("Fetching groups for user:", userId);

    const sqlQuery = `SELECT * FROM groupchat`; // assuming user_id column exists

    try {
        const result = await pool.query(sqlQuery);

        console.log("Groups retrieved:", result.rows);

         res.status(200).json({
            success: true,
            message: "Groups retrieved successfully",
            groups: result.rows,
        });
          return;
    } catch (err) {
        console.error("Error retrieving groups:", err);

         res.status(500).json({
            success: false,
            message: "Error retrieving groups",
        });
          return;
    }
};

export const getGroupMember = async (req: any, res: any) => {
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized: No user ID provided',
        });
          return;
    }

    console.log("Fetching group members for user:", userId);

    const sqlQuery = `SELECT * FROM group_member WHERE user_id = $1`;
    const values = [userId];

    try {
        const result = await pool.query(sqlQuery, values);

        console.log("Group members retrieved:", result.rows);

         res.status(200).json({
            success: true,
            message: "Group members fetched successfully!",
            groupmembers: result.rows,
        });
          return;
    } catch (err) {
        console.error("Error fetching group members:", err);

        res.status(500).json({
            success: false,
            message: "Error fetching group members",
        });
          return;
    }
};


export const searchGroup = async (req: any, res: any) => {
    const { q } = req.query;
  try {
    const result = await pool.query(
      `SELECT  * FROM groupchat
       WHERE name ILIKE $1 `,
      [`%${q}%`]
    );
   res.json({ success: true, searchresults:result.rows});
     return;
  } catch (err:any) {
    console.error(err.message);
    res.status(500).send('Server Error');
      return;
  }

}