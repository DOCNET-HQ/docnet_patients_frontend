import { useState } from "react";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfileMutation } from "@/lib/api/apiSlice";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';

type PersonalTabProps = {
    name: string;
    email: string;
    phone_number: string;
    website: string;
    country: string;
    state: string;
    city: string;
    address: string;
    postal_code: string;
    bio: string;
};

export default function Personal(
    {
        name,
        email,
        phone_number,
        website,
        country,
        state,
        city,
        address,
        postal_code,
        bio
    }: PersonalTabProps
) {
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const [formData, setFormData] = useState({
        name: name || "",
        phone_number: phone_number || "",
        website: website || "",
        country: country || "",
        state: state || "",
        city: city || "",
        address: address || "",
        postal_code: postal_code || "",
        bio: bio || "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateProfile(formData).unwrap();
            toast.success('Profile updated successfully!');
        } catch (err: any) {
            const errorMessage = err?.data?.message || 'An error occurred while updating your profile. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <TabsContent value="personal" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and profile information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={email || ""} disabled />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    id="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="postal_code">Postal Code</Label>
                                <Input
                                    id="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mt-6">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                rows={8}
                                id="bio"
                                placeholder="Tell us about your Patient"
                                value={formData.bio}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button
                                type="submit"
                                variant="default"
                                className="bg-blue-600 px-15 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>
    )
}
