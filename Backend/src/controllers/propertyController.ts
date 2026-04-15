import {Request, Response} from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types/express";
import multer from "multer";
import cloudinary from "../lib/cloudinary";


//add property
export const addProperty = async (req : AuthRequest, res : Response) =>  {
  try {
    const userId = Number(req.userId);
    const verification = await prisma.verification.findUnique({
      where : { userId }
    });
    if(!verification || verification.status !== "VERIFIED"){
      return res.status(403).json({
        message : "Access Denied : Please verify your identity first."
      })
    }
    const {title, location, size, rent, images} = req.body;

    const property = await prisma.property.create({
        data : {
            title,
            location,
            size : Number(size),
            rent : Number(rent),
            ownerId : Number(req.userId!)

        }
    });
    
  console.log("NAME:", process.env.CLOUD_NAME);
  console.log("KEY:", process.env.CLOUD_API_KEY);
  console.log("SECRET:", process.env.CLOUD_API_SECRET);
    
   const files = req.files as Express.Multer.File[];

    if(files && files.length > 0){
      for(let file of files){
        const base64 = file.buffer.toString("base64");
        const dataURI = `data:${file.mimetype};base64,${base64}`;
        console.log("Uploading to cloudinary...");
        const result = await cloudinary.uploader.upload(dataURI);
        console.log("Cloudinary result:", result);

         await prisma.propertyImage.create({
          data: {
            imageUrl : result.secure_url,
            propertyId: property.id
          }
         });

        
      }
    }
    
    const propertyWithImages = await prisma.property.findUnique({
      where: { id: property.id },
      include: { images: true }
   });
    

    res.status(201).json({
        message : "property added successfully",
        property : propertyWithImages
      }
    );

  } catch(err){
    res.status(500).json({
        message : "Failed to add property",
        error : err
        
    });
    console.log("UPLOAD ERROR:", err);
  }

};

//view available properties
export const getProperties = async (req : Request, res : Response) => {
    try{
     const properties = await prisma.property.findMany({
        where : {
            isAvailable : true
        },
        include : {
            owner :{
                select : {
                    id : true,
                    name : true
                }
            },
            images : true
        }

     });

     res.json(properties);

    } catch(err){
      res.status(500).json({
        message : "Failed to fetch properties"
      });
    }
};

//rent property
export const rentProperty = async (req : AuthRequest, res : Response) => {
    try{
     const propertyId = Number(req.params.id);

     const property = await prisma.property.findUnique({
      where : {id : propertyId}
     });
     if(!property){
      return res.status(404).json({
        message : "Property not found"
      });
     }
     if(!property.isAvailable){
      return res.status(400).json({
        message : "Property already rented"
      });
     }
     const rental = await prisma.rental.create({
         data : {
            tenantId : req.userId!,
            propertyId : propertyId
         }
     });

     await prisma.property.update({
        where : {id : propertyId},
        data : { isAvailable : false }
     });

     res.status(201).json({
        message : "Property rented",
        rental,
        ownerId : property.ownerId
     });
    } catch(err){
      res.status(500).json({
        message : "Failed to rent property"
      })
      
    }
};

// get own properties
export const getOwnerProperties = async (req : AuthRequest, res : Response) => {
    try {
        const properties = await prisma.property.findMany({
            where : {
                ownerId : req.userId
            },
            include : {
              images : true,
              rentals : {
                include : {
                  tenant : {
                    select : {
                      name : true,
                      email : true
                    }
                  }
                }
              }
            }
        });
        res.json(properties);
    } catch(err){
      res.status(500).json({
        message : "failed to fetch properties",
        error : err
      });
    }
};


// search-database filtering
export const searchProperty = async (req: Request, res: Response) => {
  try {
    const { location, minRent, maxRent } = req.query;

    const properties = await prisma.property.findMany({
      where: {
        location: location
          ? {
              contains: location as string,
              mode: "insensitive",
            }
          : undefined,

        rent:
          minRent || maxRent
            ? {
                gte: minRent ? Number(minRent) : undefined,
                lte: maxRent ? Number(maxRent) : undefined,
              }
            : undefined,
      },
    });

    res.json(properties);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Search failed",
    });
  }
};


//verification
export const uploadVerificationn = async (req : AuthRequest, res : Response) => {
  try{
    const {documentUrl} = req.body;
    const verification = await prisma.verification.upsert({
      where : {userId : req.userId!},
      update : {documentUrl},
      create : {
        userId : req.userId!,
        documentUrl
      }


    });
    res.json({
      message : "Verification submitted",
      verification
    });
  }
  catch(err){
    res.status(500).json({
      message : "Verification failed"
    })
  }
}


// review
export const addReview = async (req : AuthRequest, res : Response) => {
  try{
    const {propertyId, rating, comment} = req.body;
    const review = await prisma.review.create({
      data : {
        userId : req.userId!,
        propertyId,
        rating,
        comment
      }
    });
    res.json(review);
  } catch(err){
res.json(500).json({
  message : "Failed to add review"
})
  }
}

//get by id
export const getPropertyById = async (req : Request, res : Response ) => {
  try{
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
  return res.status(400).json({
    message: "Invalid property ID",
  });
}
    const property = await prisma.property.findUnique({
      where : {id},
      include : {
        owner : {
          select : {
            id : true,
            name : true,
          },
        },
        images : true,
      },
    })

    if(!property){
      return res.status(404).json({
        message : "Property not found",
      });
    }
    res.json(property);

  } catch(err){
    console.log("Erroe fetching property : ", err);
    res.status(500).json({
      message : "Failed to fetch property",
    });
    
  }
}

// get Rented Properties
export const getRentedProperties = async (req: AuthRequest, res: Response) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: {
        tenantId: Number(req.userId)
      },
      include: {
        property: {
          include: {
            images: true
          }
        }
      }
    });

    res.json(rentals);

  } catch (err) {
    console.log("RENTED ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch rented properties",
      error: err
    });
  }
};


//delete property
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = Number(req.params.id);

    // 1. Check if it exists and belongs to the user
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.ownerId !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this" });
    }

    // 2. Perform the cleanup
    // We use a transaction so it's all or nothing
    await prisma.$transaction([
      // Delete images first
      prisma.propertyImage.deleteMany({ where: { propertyId } }),
      
      // Delete reviews
      prisma.review.deleteMany({ where: { propertyId } }),
      
      // Delete rentals (deleteMany won't crash if the property isn't rented)
      prisma.rental.deleteMany({ where: { propertyId } }),
      
      // Finally delete the property
      prisma.property.delete({ where: { id: propertyId } }),
    ]);

    return res.json({ message: "Property deleted successfully" });

  } catch (err) {
    // Log the EXACT error to your terminal so you can see it
    console.error("CRITICAL DELETE ERROR:", err);
    
    return res.status(500).json({ 
      message: "Internal Server Error", 
      details: err instanceof Error ? err.message : "Check server logs" 
    });
  }
};

// verification controller
export const verifyUser = async (req : AuthRequest, res : Response) => {
  try{
    console.log("Multer File Object:", req.file);
    if(!req.file){
      return res.status(400).json({
        message : "Please upload an ID document"
      })
    }

    // 1. Convert the Buffer to a Base64 string that Cloudinary understands
    const fileBase64 = req.file.buffer.toString("base64");
    const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    // 2. Upload the Data URI instead of req.file.path
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "rentify_verifications",
    });

    console.log("Cloudinary Upload Success:", result.secure_url);
    //set status verified
    const verification = await prisma.verification.upsert({
      where : {userId : Number(req.userId)},
      
      
      update : {
        documentUrl : result.secure_url,
        
        status : "VERIFIED",

      },
      
      create : {
        userId : Number(req.userId),
        documentUrl : result.secure_url,
        status : "VERIFIED"
      }

    });
    res.json({
      message : "identity verified successfully",
      verification

    })
   
  } catch(err){
    res.status(500).json({
      message : "Verification failed",
      error : err
      
    })
    console.error("verification error :" ,err);

  }
}


// get me
export const getMe = async (req : AuthRequest, res : Response) => {
  try{
    const user = await prisma.user.findUnique({
      where : {id : Number(req.userId)},
      include : {
        verification : true
      }
    });
    if(!user){
      return res.status(404).json({
        message : "User not found"
      })
    }
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);





  } catch(err){
    console.error("GET_ME_ERROR:", err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }

  
}