import {Request, Response} from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types/express";

//add property
export const addProperty = async (req : AuthRequest, res : Response) =>  {
  try {
    const {title, location, size, rent} = req.body;

    const property = await prisma.property.create({
        data : {
            title,
            location,
            size,
            rent,
            ownerId : req.userId!

        }
    });
    res.status(201).json({
        message : "property added successfully",
        property}
    );

  } catch(err){
    res.status(500).json({
        message : "Failed to add property"
    });
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
            }
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