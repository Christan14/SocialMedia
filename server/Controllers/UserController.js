import userModel from "../Models/userModel.js";


// get a user
export const getUser = async(req, res) => {
    const id = req.params.id;

    try{ 
        const user = await userModel.findById(id);

        if(user)
        {
            res.status(200).json(user)
        }
    } catch (error){
        res.status(500).json(error)
    }

   
}