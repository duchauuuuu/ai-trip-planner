import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { placeName, type = "hotel" } = await req.json();
  
  try {
    // Tìm ảnh theo tên cụ thể trên toàn thế giới
    let searchQuery = "";
    if (type === "hotel") {
      // Tìm theo tên khách sạn cụ thể trên toàn thế giới
      searchQuery = `${placeName} hotel`;
    } else {
      // Tìm theo tên địa điểm cụ thể trên toàn thế giới
      searchQuery = `${placeName} travel destination attraction`;
    }
  
    console.log('Searching worldwide for:', searchQuery);
    const unsplashResponse = await axios.get(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=3&orientation=landscape&client_id=bXbCG7CxFRedpNuwRA8AUc0njnJoyCk1DtA34fmEDDM`
    );

       const fallbackImage = `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`;
    
  
    const photos = [];
    if (unsplashResponse.data?.results?.length > 0) {
    
      unsplashResponse.data.results.forEach((photo: any, index: number) => {
        photos.push({
          name: `photo_${index}`,
          widthPx: photo.width,
          heightPx: photo.height,
          photoUri: photo.urls.regular,
          description: photo.description || photo.alt_description,
          photographer: photo.user.name
        });
      });
    } else {
     
      photos.push({
        name: "photo_fallback",
        widthPx: 400,
        heightPx: 300,
        photoUri: fallbackImage,
        description: `Ảnh ${placeName}`,
        photographer: "Lorem Picsum"
      });
    }

    const mockData = {
      places: [
        {
          id: `place_${Date.now()}`,
          displayName: {
            text: placeName,
            languageCode: "vi"
          },
          photos: photos
        }
      ]
    };

    return NextResponse.json(mockData);
  } catch (e) {
    
    const fallbackData = {
      places: [
        {
          id: `place_${Date.now()}`,
          displayName: {
            text: placeName,
            languageCode: "vi"
          },
          photos: [
            {
              name: "photo_reference", 
              widthPx: 400,
              heightPx: 300,
              photoUri: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`
            }
          ]
        }
      ]
    };
    
    return NextResponse.json(fallbackData);
  }
}
