'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { useState, useEffect, type ChangeEvent } from 'react';
import { Heart, Upload, User, Calendar, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { type User as UserType } from '@supabase/supabase-js';

interface OnboardingData {
    username: string;
    partnerName: string;
    partnerBirthday: string;
    relationshipStartDate: string;
    profilePhoto: File | null;
}

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<UserType | null>(null);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('');
    const [data, setData] = useState<OnboardingData>({
        username: '',
        partnerName: '',
        partnerBirthday: '',
        relationshipStartDate: '',
        profilePhoto: null,
    });
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }
            setUser(user);
        };
        getUser();
    }, [router, supabase.auth]);

    const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setProfilePhotoUrl(previewUrl);
        setData((prev) => ({ ...prev, profilePhoto: file }));
    };

    const uploadProfilePhoto = async (file: File): Promise<string | null> => {
        if (!user) return null;

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('profile-photos')
            .upload(fileName, file, {
                upsert: true,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return null;
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from('profile-photos').getPublicUrl(fileName);

        return publicUrl;
    };

    const handleSubmit = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            let photoUrl = null;

            // Upload photo if provided
            if (data.profilePhoto) {
                photoUrl = await uploadProfilePhoto(data.profilePhoto);
                if (!photoUrl) {
                    toast.error('Failed to upload photo. Please try again.');
                    setIsLoading(false);
                    return;
                }
            }

            // Save profile data
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                username: data.username,
                email: user.email,
                partner_name: data.partnerName,
                partner_birthday: data.partnerBirthday || null,
                relationship_start_date: data.relationshipStartDate,
                profile_photo_url: photoUrl,
                updated_at: new Date().toISOString(),
            });

            if (error) throw error;

            toast.success('Profile created successfully!');
            router.push('/dashboard');
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return data.username.trim().length > 0;
            case 2:
                return data.partnerName.trim().length > 0;
            case 3:
                return data.relationshipStartDate.length > 0;
            case 4:
                return true; // Photo is optional
            default:
                return false;
        }
    };

    if (!user) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='border-primary border-b-2 rounded-full w-8 h-8 animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='flex justify-center items-center bg-gradient-to-br from-background to-card p-4 min-h-screen'>
            <div className='w-full max-w-md'>
                <Card className='bg-card/80 shadow-lg backdrop-blur-sm border-0'>
                    <CardHeader className='space-y-4 text-center'>
                        <div className='flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12'>
                            <Heart className='w-6 h-6 text-primary' />
                        </div>
                        <div>
                            <CardTitle className='font-bold text-foreground text-2xl'>
                                Welcome to Your Love Vault
                            </CardTitle>
                            <CardDescription className='text-muted-foreground'>
                                Let&apos;s set up your profile to start
                                capturing beautiful moments
                            </CardDescription>
                        </div>
                        <div className='flex justify-center space-x-2'>
                            {[1, 2, 3, 4].map((step) => (
                                <div
                                    key={step}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        step <= currentStep
                                            ? 'bg-primary'
                                            : 'bg-muted'
                                    }`}
                                />
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        {/* Step 1: Username */}
                        {currentStep === 1 && (
                            <div className='space-y-4'>
                                <div className='text-center'>
                                    <User className='mx-auto mb-2 w-8 h-8 text-primary' />
                                    <h3 className='font-semibold text-lg'>
                                        What should we call you?
                                    </h3>
                                    <p className='text-muted-foreground text-sm'>
                                        This will be your display name
                                    </p>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='username'>Your Name</Label>
                                    <Input
                                        id='username'
                                        placeholder='Enter your name'
                                        value={data.username}
                                        onChange={(e) =>
                                            setData((prev) => ({
                                                ...prev,
                                                username: e.target.value,
                                            }))
                                        }
                                        className='h-11'
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Partner Name */}
                        {currentStep === 2 && (
                            <div className='space-y-4'>
                                <div className='text-center'>
                                    <Heart className='mx-auto mb-2 w-8 h-8 text-primary' />
                                    <h3 className='font-semibold text-lg'>
                                        Tell us about your special someone
                                    </h3>
                                    <p className='text-muted-foreground text-sm'>
                                        What&apos;s your partner&apos;s name?
                                    </p>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='partnerName'>
                                        Partner&apos;s Name
                                    </Label>
                                    <Input
                                        id='partnerName'
                                        placeholder="Enter your partner's name"
                                        value={data.partnerName}
                                        onChange={(e) =>
                                            setData((prev) => ({
                                                ...prev,
                                                partnerName: e.target.value,
                                            }))
                                        }
                                        className='h-11'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='partnerBirthday'>
                                        Partner&apos;s Birthday (Optional)
                                    </Label>
                                    <Input
                                        id='partnerBirthday'
                                        type='date'
                                        value={data.partnerBirthday}
                                        onChange={(e) =>
                                            setData((prev) => ({
                                                ...prev,
                                                partnerBirthday: e.target.value,
                                            }))
                                        }
                                        className='h-11'
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Relationship Timeline */}
                        {currentStep === 3 && (
                            <div className='space-y-4'>
                                <div className='text-center'>
                                    <Calendar className='mx-auto mb-2 w-8 h-8 text-primary' />
                                    <h3 className='font-semibold text-lg'>
                                        When did your story begin?
                                    </h3>
                                    <p className='text-muted-foreground text-sm'>
                                        The date you got together
                                    </p>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='relationshipStart'>
                                        Relationship Start Date
                                    </Label>
                                    <Input
                                        id='relationshipStart'
                                        type='date'
                                        value={data.relationshipStartDate}
                                        onChange={(e) =>
                                            setData((prev) => ({
                                                ...prev,
                                                relationshipStartDate:
                                                    e.target.value,
                                            }))
                                        }
                                        className='h-11'
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Profile Photo */}
                        {currentStep === 4 && (
                            <div className='space-y-4'>
                                <div className='text-center'>
                                    <Camera className='mx-auto mb-2 w-8 h-8 text-primary' />
                                    <h3 className='font-semibold text-lg'>
                                        Add a profile photo
                                    </h3>
                                    <p className='text-muted-foreground text-sm'>
                                        Optional - you can always add this later
                                    </p>
                                </div>
                                <div className='flex flex-col items-center space-y-4'>
                                    <Avatar className='w-24 h-24'>
                                        <AvatarImage
                                            src={
                                                profilePhotoUrl ||
                                                '/placeholder.svg'
                                            }
                                        />
                                        <AvatarFallback className='bg-primary/10 text-primary text-lg'>
                                            {data.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='relative'>
                                        <input
                                            type='file'
                                            accept='image/*'
                                            onChange={handlePhotoUpload}
                                            className='absolute inset-0 opacity-0 w-full h-full cursor-pointer'
                                        />
                                        <Button
                                            variant='outline'
                                            className='flex items-center space-x-2 bg-transparent'
                                        >
                                            <Upload className='w-4 h-4' />
                                            <span>Upload Photo</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className='flex justify-between pt-4'>
                            <Button
                                variant='outline'
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className='bg-transparent w-24'
                            >
                                Back
                            </Button>
                            {currentStep < 4 ? (
                                <Button
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className='w-24'
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className='w-32'
                                >
                                    {isLoading ? 'Creating...' : 'Complete'}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
