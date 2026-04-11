import {Request, Response} from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types/express";
import multer from "multer";
import cloudinary from "../lib/cloudinary";


//add property
export const addProperty = async (req : AuthRequest, res : Response) =>  {
  try {
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
        rental
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
              images : true
            }
        });
        res.json(properties);
    } catch(err){
      res.status(500).json({
        message : "failed to fetch properties"
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
    }),

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