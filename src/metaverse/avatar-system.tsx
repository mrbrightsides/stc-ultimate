'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Palette, 
  Shirt, 
  Users, 
  Save,
  RefreshCw,
  Eye,
  Sparkles
} from 'lucide-react';

interface AvatarConfig {
  name: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  accessory: string;
}

const skinTones = ['#FFDAB9', '#F0D5BE', '#E8B887', '#D1A184', '#C68642', '#8D5524'];
const hairStyles = ['Short', 'Long', 'Curly', 'Bald', 'Ponytail', 'Braids'];
const hairColors = ['#000000', '#5C4033', '#8B4513', '#D2691E', '#FFD700', '#FF6347'];
const outfits = ['Casual', 'Formal', 'Traditional Batik', 'Beach Wear', 'Hiking Gear', 'Business'];
const accessories = ['None', 'Sunglasses', 'Hat', 'Backpack', 'Camera', 'Traditional Headpiece'];

export default function AvatarSystem(): JSX.Element {
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    name: 'Tourist',
    skinTone: skinTones[2],
    hairStyle: 'Short',
    hairColor: hairColors[1],
    outfit: 'Casual',
    accessory: 'Camera',
  });

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const updateConfig = (key: keyof AvatarConfig, value: string): void => {
    setAvatarConfig(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = (): void => {
    // In real app, this would save to blockchain/database
    localStorage.setItem('stc-avatar', JSON.stringify(avatarConfig));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRandomize = (): void => {
    setAvatarConfig({
      name: avatarConfig.name,
      skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
      hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      outfit: outfits[Math.floor(Math.random() * outfits.length)],
      accessory: accessories[Math.floor(Math.random() * accessories.length)],
    });
    setIsSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-green-400" />
            Avatar Customization
          </CardTitle>
          <CardDescription className="text-gray-400">
            Create your unique virtual identity for the metaverse
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Avatar Preview */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-cyan-400" />
              Avatar Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Simple Avatar Representation */}
              <div className="relative">
                {/* Head */}
                <div 
                  className="w-32 h-32 rounded-full mx-auto"
                  style={{ backgroundColor: avatarConfig.skinTone }}
                />
                
                {/* Hair */}
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-20 rounded-t-full"
                  style={{ backgroundColor: avatarConfig.hairColor }}
                />

                {/* Eyes */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-6">
                  <div className="w-3 h-3 bg-gray-900 rounded-full" />
                  <div className="w-3 h-3 bg-gray-900 rounded-full" />
                </div>

                {/* Smile */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-12 h-6 border-b-2 border-gray-900 rounded-b-full" />

                {/* Body/Outfit */}
                <div className="mt-4 w-40 h-48 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-lg mx-auto relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white text-xs font-semibold">
                    {avatarConfig.outfit}
                  </div>
                </div>

                {/* Accessory Badge */}
                {avatarConfig.accessory !== 'None' && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                      {avatarConfig.accessory}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Sparkle Effect */}
              <div className="absolute top-4 right-4">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-semibold mb-2">Avatar Name</p>
                <p className="text-white text-xl font-bold">{avatarConfig.name}</p>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  onClick={handleSave}
                  disabled={isSaved}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaved ? 'Saved!' : 'Save Avatar'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleRandomize}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customization Options */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-400" />
              Customize
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="gear">Gear</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 mt-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-white">Avatar Name</Label>
                  <Input
                    value={avatarConfig.name}
                    onChange={(e) => updateConfig('name', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Skin Tone */}
                <div className="space-y-2">
                  <Label className="text-white">Skin Tone</Label>
                  <div className="flex gap-2 flex-wrap">
                    {skinTones.map((tone) => (
                      <button
                        key={tone}
                        onClick={() => updateConfig('skinTone', tone)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          avatarConfig.skinTone === tone
                            ? 'border-green-400 scale-110'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: tone }}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-6 mt-6">
                {/* Hair Style */}
                <div className="space-y-2">
                  <Label className="text-white">Hair Style</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {hairStyles.map((style) => (
                      <Button
                        key={style}
                        onClick={() => updateConfig('hairStyle', style)}
                        variant={avatarConfig.hairStyle === style ? 'default' : 'outline'}
                        size="sm"
                        className={avatarConfig.hairStyle === style ? 'bg-green-500' : ''}
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div className="space-y-2">
                  <Label className="text-white">Hair Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {hairColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateConfig('hairColor', color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          avatarConfig.hairColor === color
                            ? 'border-green-400 scale-110'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gear" className="space-y-6 mt-6">
                {/* Outfit */}
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <Shirt className="h-4 w-4" />
                    Outfit
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {outfits.map((outfit) => (
                      <Button
                        key={outfit}
                        onClick={() => updateConfig('outfit', outfit)}
                        variant={avatarConfig.outfit === outfit ? 'default' : 'outline'}
                        size="sm"
                        className={avatarConfig.outfit === outfit ? 'bg-cyan-500' : ''}
                      >
                        {outfit}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Accessory */}
                <div className="space-y-2">
                  <Label className="text-white">Accessory</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {accessories.map((accessory) => (
                      <Button
                        key={accessory}
                        onClick={() => updateConfig('accessory', accessory)}
                        variant={avatarConfig.accessory === accessory ? 'default' : 'outline'}
                        size="sm"
                        className={avatarConfig.accessory === accessory ? 'bg-purple-500' : ''}
                      >
                        {accessory}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Social Features */}
      <Card className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-green-400" />
            Social Features (Coming Soon)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 font-semibold mb-1">Friends</p>
              <p className="text-gray-300 text-2xl font-bold">0</p>
            </div>
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-cyan-400 font-semibold mb-1">Visits</p>
              <p className="text-gray-300 text-2xl font-bold">1</p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-purple-400 font-semibold mb-1">Achievements</p>
              <p className="text-gray-300 text-2xl font-bold">0</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm text-center">
            Meet other travelers, explore together, and unlock achievements in the metaverse!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
