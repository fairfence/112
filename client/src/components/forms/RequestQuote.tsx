import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Upload,
  X,
  Send,
  Camera,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/lib/supabase";

interface FenceLineData {
  lineDescription: string;
  length: string;
  height: string;
  fenceType: string;
  railWireCount: string;
  specialNotes: string;
}

interface RequestQuoteProps {
  className?: string;
}

export default function RequestQuote({ className }: RequestQuoteProps) {
  const { toast } = useToast();
  const { getContent } = useSiteContent();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    propertyAddress: "",
    removalRequired: false,
    additionalNotes: ""
  });

  const [fenceLines, setFenceLines] = useState<FenceLineData[]>([{
    lineDescription: "",
    length: "",
    height: "",
    fenceType: "",
    railWireCount: "",
    specialNotes: ""
  }]);

  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFenceLineChange = (index: number, field: keyof FenceLineData, value: string) => {
    const updated = [...fenceLines];
    updated[index] = { ...updated[index], [field]: value };
    setFenceLines(updated);
  };

  const addFenceLine = () => {
    setFenceLines([...fenceLines, {
      lineDescription: "",
      length: "",
      height: "",
      fenceType: "",
      railWireCount: "",
      specialNotes: ""
    }]);
  };

  const removeFenceLine = (index: number) => {
    if (fenceLines.length > 1) {
      setFenceLines(fenceLines.filter((_, i) => i !== index));
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + selectedPhotos.length > 20) {
      toast({
        title: "Too Many Files",
        description: "Maximum 20 photos allowed per survey",
        variant: "destructive"
      });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5242880) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 5MB limit`,
          variant: "destructive"
        });
        return false;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not an image`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    setSelectedPhotos([...selectedPhotos, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(selectedPhotos.filter((_, i) => i !== index));
    setPhotoPreviewUrls(photoPreviewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.phone || !formData.propertyAddress) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in customer name, phone, and property address",
        variant: "destructive"
      });
      return;
    }

    const hasValidFenceLine = fenceLines.some(line =>
      line.length && parseFloat(line.length) > 0 && line.fenceType
    );

    if (!hasValidFenceLine) {
      toast({
        title: "Incomplete Fence Line",
        description: "At least one fence line must have length and fence type",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const photoUrls: string[] = [];

      if (selectedPhotos.length > 0) {
        for (const photo of selectedPhotos) {
          const fileExt = photo.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `surveys/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('survey-photos')
            .upload(filePath, photo, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Photo upload error:', uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('survey-photos')
            .getPublicUrl(filePath);

          photoUrls.push(publicUrl);
        }
      }

      const surveyData = {
        ...formData,
        fenceLines: fenceLines.filter(line =>
          line.length && parseFloat(line.length) > 0 && line.fenceType
        ),
        photoUrls
      };

      const response = await fetch('/api/site-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Survey Submitted Successfully!",
          description: result.emailSent
            ? "We've received your site survey and sent you a confirmation."
            : "We've received your site survey and will contact you soon.",
        });

        setFormData({
          customerName: "",
          phone: "",
          email: "",
          propertyAddress: "",
          removalRequired: false,
          additionalNotes: ""
        });
        setFenceLines([{
          lineDescription: "",
          length: "",
          height: "",
          fenceType: "",
          railWireCount: "",
          specialNotes: ""
        }]);
        setSelectedPhotos([]);
        setPhotoPreviewUrls([]);
      } else {
        toast({
          title: "Submission Error",
          description: result.error || "Please try again or contact us directly.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Survey submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showRailWireOptions = (fenceType: string) => {
    return ['post-rail', 'batten-wire', 'wire-fence', 'electric-wire'].includes(fenceType);
  };

  return (
    <section id="request-quote" className={`py-16 sm:py-20 bg-gradient-to-b from-orange-950 via-black to-black relative overflow-hidden ${className || ''}`}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-orange-900/30 to-black" />
        <div className="absolute top-10 left-0 w-full h-32 bg-gradient-to-r from-transparent via-orange-800/40 to-transparent transform -rotate-2" />
      </div>

      <div className="relative z-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">Detailed Quote Request</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Site Survey Form
            </h2>
            <p className="text-lg text-muted-foreground">
              Get an accurate quote by providing detailed information about your fencing project
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Complete Site Survey
              </CardTitle>
              <CardDescription>
                Fill out the form below with details about your property and fencing requirements
              </CardDescription>

              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Privacy Notice</h3>
                <p className="text-xs text-muted-foreground">
                  We collect your personal information to provide fencing services and maintain our business relationship.
                  Your information is stored securely and will only be used for the purposes stated. Under the Privacy Act 2020,
                  you have rights to access and correct your personal information.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-l-4 border-primary pl-3">
                    Customer Information
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        required
                        value={formData.customerName}
                        onChange={handleInputChange}
                        placeholder="John Smith"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="021 123 4567"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="propertyAddress">Property Address *</Label>
                      <Input
                        id="propertyAddress"
                        name="propertyAddress"
                        required
                        value={formData.propertyAddress}
                        onChange={handleInputChange}
                        placeholder="123 Main Street, Hamilton"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-l-4 border-primary pl-3">
                      Fence Lines
                    </h3>
                    <Button
                      type="button"
                      onClick={addFenceLine}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Fence Line
                    </Button>
                  </div>

                  {fenceLines.map((line, index) => (
                    <Card key={index} className="border-2 border-orange-100 dark:border-orange-900/30">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Fence Line {index + 1}</CardTitle>
                          {fenceLines.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFenceLine(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Line Description</Label>
                          <Input
                            value={line.lineDescription}
                            onChange={(e) => handleFenceLineChange(index, 'lineDescription', e.target.value)}
                            placeholder="e.g., Front boundary, Side return, Back fence"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Length (metres) *</Label>
                            <Input
                              type="number"
                              step="0.1"
                              min="0.1"
                              value={line.length}
                              onChange={(e) => handleFenceLineChange(index, 'length', e.target.value)}
                              placeholder="10.5"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Height</Label>
                            <Select
                              value={line.height}
                              onValueChange={(value) => handleFenceLineChange(index, 'height', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select height" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1.2m">1.2m</SelectItem>
                                <SelectItem value="1.8m">1.8m</SelectItem>
                                <SelectItem value="2.1m">2.1m</SelectItem>
                                <SelectItem value="Custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Fence Type *</Label>
                          <Select
                            value={line.fenceType}
                            onValueChange={(value) => handleFenceLineChange(index, 'fenceType', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select fence type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="timber-standard">Timber - Standard Paling</SelectItem>
                              <SelectItem value="timber-capped">Timber - Capped Paling</SelectItem>
                              <SelectItem value="timber-lapped-capped">Timber - Lapped & Capped</SelectItem>
                              <SelectItem value="aluminium-pet">Aluminium - Pet Fencing</SelectItem>
                              <SelectItem value="aluminium-pool">Aluminium - Pool Fencing</SelectItem>
                              <SelectItem value="aluminium-other">Aluminium - Other</SelectItem>
                              <SelectItem value="post-rail">Post & Rail</SelectItem>
                              <SelectItem value="batten-wire">Batten & Wire</SelectItem>
                              <SelectItem value="wire-fence">Wire Fence</SelectItem>
                              <SelectItem value="electric-wire">Electric Wire Fence</SelectItem>
                              <SelectItem value="colourSteel">Colour Steel</SelectItem>
                              <SelectItem value="composite">Wood Composite</SelectItem>
                              <SelectItem value="chainLink">Chain Link</SelectItem>
                              <SelectItem value="retaining">Retaining Wall</SelectItem>
                              <SelectItem value="deck">Deck</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {showRailWireOptions(line.fenceType) && (
                          <div className="space-y-2">
                            <Label>Number of Rails/Wires</Label>
                            <Select
                              value={line.railWireCount}
                              onValueChange={(value) => handleFenceLineChange(index, 'railWireCount', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select number" />
                              </SelectTrigger>
                              <SelectContent>
                                {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                ))}
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Special Notes for this Line</Label>
                          <Textarea
                            value={line.specialNotes}
                            onChange={(e) => handleFenceLineChange(index, 'specialNotes', e.target.value)}
                            rows={2}
                            placeholder="Access issues, slopes, existing structures, gates needed, etc."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-l-4 border-primary pl-3">
                    Additional Work
                  </h3>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="removalRequired"
                      checked={formData.removalRequired}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, removalRequired: Boolean(checked) }))
                      }
                    />
                    <Label htmlFor="removalRequired" className="cursor-pointer">
                      Removal of existing fencing required
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Other Work / Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Gates, unusual access, material preferences, timeline, etc."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-l-4 border-primary pl-3">
                    Site Photos
                  </h3>

                  <div className="border-2 border-dashed border-orange-500 rounded-lg p-6 text-center bg-orange-50/50 dark:bg-orange-950/10">
                    <Camera className="h-12 w-12 mx-auto mb-3 text-orange-500" />
                    <p className="text-sm font-medium mb-2">
                      Take photos of fence lines, access points, and problem areas
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoSelect}
                      className="max-w-xs mx-auto cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Maximum 5MB per photo. Up to 20 photos allowed.
                    </p>
                  </div>

                  {photoPreviewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {photoPreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-center mt-1 truncate">
                            {selectedPhotos[index]?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Complete Site Survey
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
