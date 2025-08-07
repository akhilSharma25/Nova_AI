import sql from "../config/db.js"

export const getUserCreations=async(req,res)=>{
    try {
        const {userId}=req.auth()

        
      const creations=  await sql`SELECT * FROM creations where user_id=${userId} ORDER BY created_at DESC`
                   res.status(200).json({ success: true, message: creations});

    } catch (error) {
      console.log(error);
      
                   res.status(500).json({ success: false, message: error.message });

    }
}
export const getPublishedCreations=async(req,res)=>{
    try {

      const creations=  await sql`SELECT * FROM creations where publish=true ORDER BY created_at DESC`
                   res.status(200).json({ success: true, message: creations});

    } catch (error) {
                   res.status(500).json({ success: false, message: error.message });

    }
}
export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res.json({ message: "Creation not found", success: false });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((u) => u !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked";
    }

    await sql`
      UPDATE creations
      SET likes = ${updatedLikes}::text[]
      WHERE id = ${id}
    `;

    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


