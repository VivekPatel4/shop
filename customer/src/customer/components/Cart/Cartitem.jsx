import { Button, IconButton } from "@mui/material";
import React from "react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
const Cartitem = () => {
  return (
    <div className="p-5 shadow-lg border rounded-md">
      <div className="flex items-center">
        <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]">
          <img
            className="w-full h-full object-cover object-top"
            src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR-oUnlRjsBqZToFABpl2fLlOMOS_8RSTN9jsQbUCpqUqE3ymwt3ciA7LZ07E0-QScsMd_Xn9ipNUelnu_nmt47XvAzOeov9-qTIZFr3c9v68L4M15DenG6lQ"
            alt=""
          />
        </div>

        <div className="ml-5 space-y-1">
          <p className="font-semibold">
            Denim Light Wash Blue Jeans by The Souled Store Men
          </p>
          <p className="opacity-70">Size: L,White</p>
          <p className="opacity-70 mt-2">Seller:zipping collection</p>

          <div className="flex space-x-5 items-center text-gray-900 pt-6">
            <p className="font-semibold">$199</p>
            <p className="opacity-50 line-through">$211</p>
            <p className="text-green-600 font-semibold">5%off</p>
          </div>
        </div>

        
      </div>
      <div className="lg:flex items-center lg:space-x-10 pt-4">

            <div className="flex items-center space-x-2">
                <IconButton>
                     <RemoveCircleOutlineIcon/>
                </IconButton>
                <span className="py-1 px-7 border rounded-sm">3</span>
                <IconButton sx={{color:"RGB(145 85 253)"}}>
                     <AddCircleOutlineIcon/>
                </IconButton>
              
            </div>


            <div>
                <Button sx={{color:"RGB(145 85 253)"}}>remove</Button>
            </div>
                 

        </div>
    </div>
  );
};

export default Cartitem;
