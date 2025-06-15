import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'

import { uploadToCloudinary } from '../utils/cloudinary';

//Retrieve connected Users
export const getOnlineUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       res.status(401).json({ success: false, message: 'Unauthorized: User not identified' });
        return;
    }

    console.log(`userid ${userId}`);

    const sqlSearch = 'SELECT * FROM users WHERE status = $1 AND NOT id = $2';
    const values = ['online', userId];

    const result = await pool.query(sqlSearch, values);

    if (result.rows.length === 0) {
       res.json({ success: true, message: 'No other users online', users: [] });
        return;
    }

    console.log('onlineUsers found!');
    res.json({ success: true, message: 'Online users found!', users: result.rows });
     return;

  } catch (error) {
    console.error('Error retrieving online users:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving online users' });
     return;
  }
}


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const sqlSearch = 'SELECT * FROM users';
    const result = await pool.query(sqlSearch);

    if (result.rows.length === 0) {
       res.json({ success: true, message: 'No users found.', users: [] });
       return;
    }

    console.log('All users found!');
    res.json({ success: true, message: 'All users retrieved successfully.', users: result.rows });
     return;

  } catch (error) {
    console.error('Error retrieving all users:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving users' });
     return;
  }
};


// Get user profile
export const UpdateProfileImage = async (req: Request, res: Response) => {
  try {
  
 if (!req.files || Array.isArray(req.files)) {
res.status(400).json({ success: false, message: "No image file uploaded" });
  return;
}

if (!req.files['image'] || !req.files['image'][0]) {
   res.status(400).json({ success: false, message: "No image file uploaded" });
     return;
}
    const imageFilePath = req.files['image'][0].path;
    const userId = req.user?.id;

    let imageData = {};
    if (imageFilePath) {
      imageData = await uploadToCloudinary(imageFilePath, "chatplanetassets");
    }

    const sqlUpdate = `UPDATE users SET profile_image = $1 WHERE id = $2`;
    const values = [JSON.stringify(imageData), userId];

    await pool.query(sqlUpdate, values);

    console.log('Profile image update successful');
     res.json({ success: true, message: "Profile Image Update successful!" });
      return;
  } catch (err) {
    console.error(err);
  res.json({ success: false, message: "Network error!" });
   return;
  }
};


//update user profile
export const updateAbout = (req: Request, res: Response) => {
  const { about } = req.body;
  const userid = req.user?.id;

  if (!userid) {
     res.json({ success: false, message: "No user found!" });
      return;
  }

  const sqlUpdate = `UPDATE users SET about = $1 WHERE id = $2`;
  const values = [about, userid];

  pool.query(sqlUpdate, values, (err, result: any) => {
    if (err) {
      console.error(err);
     res.json({ success: false, message: "Update failed!" });
      return;
    }
    console.log("Update success!");
     res.json({ success: true, message: "Profile update successful!" });
      return;
  });
};

export const updateLocation = (req: Request, res: Response) => {
  const { location } = req.body;
  const userid = req.user?.id;

  if (!userid) {
    res.status(401).json({ success: false, message: "No user found!" });
     return;
  }

  const sqlUpdate = `UPDATE users SET country = $1 WHERE id = $2`;
  const values = [location, userid];

  pool.query(sqlUpdate, values, (err: any, result: any) => {
    if (err) {
      console.error('Update error:', err);
       res.status(500).json({ success: false, message: "Update failed!" });
        return;
    }
    console.log('Update success!');
     res.json({ success: true, message: "Country updated successfully!" });
      return;
  });
};



export const updatePhoneContact = (req: Request, res: Response) => {
  const { mobile } = req.body;
  const userid = req.user?.id;

  if (!userid) {
     res.status(401).json({ success: false, message: "No user found!" });
      return;
  }

  const sqlUpdate = `UPDATE users SET mobile = $1 WHERE id = $2`;
  const values = [mobile, userid];

  pool.query(sqlUpdate, values, (err: any, result: any) => {
    if (err) {
      console.error('Update error:', err);
       res.status(500).json({ success: false, message: "Update failed!" });
        return;
    }
    console.log('Update success!');
     res.json({ success: true, message: "Phone Contact Updated Successfully!" });
      return;
  });
};