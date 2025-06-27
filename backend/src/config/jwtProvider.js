const jwt=require("jsonwebtoken");


const SECRET_key="hsbfhshfhfhbjfhfhfvyvbbmggfmgfhyudtysvdgbvjknghfghkfgbff";

const generateToken=(userId)=>{
    const token=jwt.sign({userId},SECRET_key,{expiresIn:"48h"})
    return token;
}

const getUserIdFromToken=(token)=>{
    const decodedToken=jwt.verify(token,SECRET_key)
    return decodedToken.userId;
}

module.exports={generateToken,getUserIdFromToken}