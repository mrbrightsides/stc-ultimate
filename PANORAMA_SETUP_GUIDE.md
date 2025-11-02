# 📸 STC Ultimate - 360° Panorama Setup Guide

## 🎯 Overview
This guide will help you replace the mockup panoramas with real 360° images for your tourism platform.

---

## 📋 Step-by-Step Setup

### 1️⃣ **Get Your 360° Images**

#### Option A: Capture Your Own
Use a 360° camera to capture real locations:
- **Recommended Cameras:**
  - Ricoh Theta Z1 / X (Professional)
  - Insta360 ONE X2 / X3 (Consumer-friendly)
  - GoPro MAX (Action-oriented)
  - Samsung Gear 360 (Budget option)

#### Option B: Hire a Photographer
- Search for "360 virtual tour photographer" + your city
- Cost: ~$200-500 per location
- They'll provide ready-to-use equirectangular images

#### Option C: Buy Stock Images
- **Paid Sources:**
  - [Adobe Stock 360°](https://stock.adobe.com/)
  - [Shutterstock 360°](https://www.shutterstock.com/)
  - [iStock 360° VR](https://www.istockphoto.com/)
  
- **Free Sources:**
  - [Flickr Equirectangular Group](https://www.flickr.com/groups/equirectangular/)
  - [Pixexid](https://www.pixexid.com/)
  - Sample 360° images from camera manufacturers

---

### 2️⃣ **Image Requirements**

✅ **Required Format:**
- **Equirectangular projection** (2:1 aspect ratio)
- **Recommended Resolution:** 4096x2048px minimum (4K quality)
- **Maximum Resolution:** 8192x4096px (8K - best quality)
- **File Format:** JPG (recommended) or PNG
- **File Size:** Keep under 5MB per image for web performance

❌ **Common Mistakes:**
- Using regular photos (not 360°)
- Wrong aspect ratio (not 2:1)
- Too low resolution (blurry when zoomed)
- Too large file size (slow loading)

---

### 3️⃣ **Folder Structure**

Create the following folder in your project root:

```
public/
└── panoramas/
    ├── bali-hotel-room.jpg
    ├── bali-restaurant.jpg
    ├── bali-beach.jpg
    ├── bali-temple.jpg
    ├── yogyakarta-hotel-room.jpg
    ├── yogyakarta-restaurant.jpg
    ├── yogyakarta-borobudur.jpg
    ├── yogyakarta-prambanan.jpg
    ├── lombok-hotel-room.jpg
    ├── lombok-restaurant.jpg
    ├── lombok-gili.jpg
    ├── lombok-rinjani.jpg
    ├── jakarta-hotel-room.jpg
    ├── jakarta-restaurant.jpg
    ├── jakarta-monas.jpg
    └── jakarta-kota-tua.jpg
```

---

### 4️⃣ **File Naming Convention**

Follow this pattern:
```
{destination}-{location-type}.jpg
```

**Examples:**
- `bali-hotel-room.jpg` → Bali hotel room panorama
- `yogyakarta-borobudur.jpg` → Yogyakarta Borobudur temple
- `lombok-gili.jpg` → Lombok Gili Islands

---

### 5️⃣ **How to Add Images**

#### Via File Manager:
1. Navigate to your project folder
2. Go to `public/` directory
3. Create `panoramas/` folder if it doesn't exist
4. Upload your 360° images with correct names

#### Via Command Line:
```bash
# Create panoramas directory
mkdir -p public/panoramas

# Copy your 360° images (example)
cp /path/to/your/360-images/*.jpg public/panoramas/
```

---

### 6️⃣ **Adding New Destinations**

To add panoramas for new destinations, edit: `src/lib/panorama-config.ts`

**Example:**
```typescript
{
  destinationId: 'ubud',  // Must match destination ID
  destinationName: 'Ubud',
  panoramas: [
    {
      id: 'ubud-rice-terrace',
      name: 'Rice Terrace View',
      description: 'Stunning Tegallalang rice terraces',
      imagePath: '/panoramas/ubud-rice-terrace.jpg',  // Your image path
      fallbackColor: '#10b981',  // Color shown if image fails
      hotspots: [
        {
          position: [10, 5, -10],
          label: 'Main Terrace',
          color: '#06b6d4',
          description: 'Top viewing platform',
        },
        // Add more hotspots...
      ],
    },
    // Add more panoramas...
  ],
}
```

---

### 7️⃣ **Optimizing Images for Web**

Before uploading, optimize your images:

#### Using Online Tools:
- [TinyPNG](https://tinypng.com/) - Best compression
- [Squoosh](https://squoosh.app/) - Advanced options

#### Using Command Line (ImageMagick):
```bash
# Resize and compress
convert input.jpg -resize 4096x2048 -quality 85 output.jpg
```

#### Using Photoshop:
1. Open image
2. Image → Image Size → 4096x2048px
3. File → Export → Save for Web
4. Quality: 80-85%

---

### 8️⃣ **Testing Your Panoramas**

After uploading:

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the Metaverse section**
3. **Click "360° Panoramic Views"**
4. **Check each destination:**
   - ✅ Image loads correctly
   - ✅ 360° rotation works smoothly
   - ✅ Hotspots appear in correct positions
   - ✅ Zoom in/out functions properly

---

### 9️⃣ **Troubleshooting**

#### Problem: Image doesn't load
- ✅ Check file name matches exactly (case-sensitive)
- ✅ Verify file is in `public/panoramas/` folder
- ✅ Check console for error messages
- ✅ Ensure image format is JPG or PNG

#### Problem: Image looks distorted
- ✅ Verify image is equirectangular (2:1 ratio)
- ✅ Check orientation (0° should face forward)
- ✅ Re-export from 360° camera software

#### Problem: Image is blurry
- ✅ Use higher resolution (minimum 4096x2048px)
- ✅ Check compression quality (use 85%+)
- ✅ Ensure source image is high quality

#### Problem: Page loads slowly
- ✅ Compress images (target 2-5MB per image)
- ✅ Use JPG instead of PNG
- ✅ Consider progressive JPG format

---

### 🔟 **Advanced Features**

#### A. Adding Hotspot Interactions
Edit `src/lib/panorama-config.ts` to add interactive hotspots:
```typescript
hotspots: [
  {
    position: [10, 5, -10],  // 3D coordinates
    label: 'Reception Desk',
    color: '#06b6d4',
    description: 'Check-in area',
    linkedPanoramaId: 'bali-reception',  // Link to another panorama
  },
]
```

#### B. Linking Panoramas Together
Connect multiple panoramas for virtual tours:
```typescript
{
  id: 'hotel-lobby',
  linkedPanoramaId: 'hotel-room',  // Clicking hotspot loads this panorama
  // ...
}
```

---

## 📊 Recommended Image Specifications

| Aspect | Specification |
|--------|--------------|
| **Resolution** | 4096x2048px (4K) or 8192x4096px (8K) |
| **Aspect Ratio** | 2:1 (Equirectangular) |
| **Format** | JPG (recommended), PNG |
| **Color Space** | sRGB |
| **File Size** | 2-5MB per image |
| **Compression** | 80-85% quality |
| **Projection** | Equirectangular (spherical) |

---

## 🎥 Free Sample 360° Images for Testing

1. **Ricoh Theta Sample Gallery:**
   - https://theta360.com/en/gallery/

2. **Flickr Equirectangular Group:**
   - https://www.flickr.com/groups/equirectangular/

3. **Insta360 Gallery:**
   - https://www.insta360.com/gallery

Download samples, rename them according to the naming convention, and test!

---

## ✨ Tips for Best Results

1. **Capture at golden hour** (sunrise/sunset) for beautiful lighting
2. **Avoid people in frame** unless showing occupancy
3. **Use tripod** for stable, level shots
4. **Shoot RAW** if possible for better post-processing
5. **Take multiple shots** of each location for backup
6. **Edit in specialized software** (PTGui, Hugin) for stitching
7. **Add HDR** for better dynamic range in high-contrast scenes
8. **Consider season** - capture during best weather

---

## 🚀 Quick Start Checklist

- [ ] Choose 360° image source (camera/photographer/stock)
- [ ] Create `public/panoramas/` folder
- [ ] Download/capture 360° images (equirectangular format)
- [ ] Rename images to match configuration
- [ ] Optimize images (resize, compress)
- [ ] Upload to `public/panoramas/`
- [ ] Test in browser
- [ ] Adjust hotspot positions if needed
- [ ] Deploy to production

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify image format and naming
3. Test with sample 360° images first
4. Review the panorama configuration file

---

## 🎉 You're Ready!

Once your images are in place, the system will automatically:
- ✅ Load real 360° panoramas
- ✅ Display interactive hotspots
- ✅ Enable smooth navigation
- ✅ Show fallback colors if images fail

Your virtual tourism experience is now production-ready! 🚀
