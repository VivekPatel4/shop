import {Button, Grid, Typography} from "@mui/material";
import React from "react";
import { Link } from "react-alice-carousel";

const Footer=()=>{
    return(
        <div>
           <Grid className="bg-black text-white text-center mt-10"
           container
           sx={{bgcolor:"black",color:"white",py:3}}
           >

            <Grid item xs={12} sm={6} md={3}>
                <Typography className="pb-5" variant="h6"> Company </Typography>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> About </Button>            
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Blog </Button>
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Press </Button>
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Jobs </Button>
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Partners </Button>
                </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Typography className="pb-5" variant="h6"> Solutions </Typography>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Marketing </Button>            
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Commerce </Button>
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Insights </Button>
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Support </Button>
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Analytics</Button>
                </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Typography className="pb-5" variant="h6"> Documentation </Typography>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Guides </Button>            
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> API Status </Button>
                </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <Typography className="pb-5" variant="h6"> Legal </Typography>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Claim </Button>            
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Privacy </Button>
                </div>
                <div>
                <Button className="pb-5" variant="text" sx={{ color: 'white' }}> Terms </Button>
                </div>
            </Grid>
            
            <Grid className="pt-20" item xs={12}>
                <Typography variant="body2" component="p" align="center">
                    &copy; 2024 My Company.All Rights reserved.
                </Typography>
                <Typography variant="body2" component="p" align="center">
                    Made by zipping
                </Typography>
                <Typography variant="body2" component="p" align="center">
                    Icons made by{' '}
                    <Link href="https://www.freepink.com" color="inherit" underline="always">
                      Freepik
                    </Link>{' '}
                    from{' '}
                    <Link href="https://www.flaticon.com" color="inherit" underline="always">
                      www.Flaticon.com
                    </Link>
                </Typography>
            </Grid>
           </Grid>
        </div>
    )
}

export default Footer;