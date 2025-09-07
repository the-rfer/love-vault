'use client';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Upload, User, Calendar, Camera } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createProfile } from '@/actions/onboarding/create';
import { DatePicker } from '@/components/date-picker';
import { formatDateToLocalString } from '@/lib/utils';
import { OnboardingData } from '@/types/app';

export function Onboarding({
    userId,
    userEmail,
}: {
    userId: string;
    userEmail: string;
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('');
    const [data, setData] = useState<OnboardingData>({
        userId,
        email: userEmail,
        username: '',
        partnerName: '',
        partnerBirthday: '',
        relationshipStartDate: formatDateToLocalString(new Date())!,
        profilePhoto: undefined,
    });
    const router = useRouter();

    const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setProfilePhotoUrl(URL.createObjectURL(file));
        setData((prev) => ({ ...prev, profilePhoto: file }));
    };

    const handleSubmit = async () => {
        if (!userId || !userEmail) return;

        setIsLoading(true);
        try {
            const { error } = await createProfile(data);

            if (error) throw error;

            toast.success('Profile created successfully!');
            router.push('/');
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
                return data.relationshipStartDate !== undefined;
            case 4:
                return true;
            default:
                return false;
        }
    };

    return (
        <CardContent className='space-y-6'>
            <div className='flex justify-center space-x-2'>
                {[1, 2, 3, 4].map((step) => (
                    <div
                        key={step}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            step <= currentStep ? 'bg-primary' : 'bg-muted'
                        }`}
                    />
                ))}
            </div>

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
                        <Label htmlFor='partnerName'>Partner&apos;s Name</Label>
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

                        <DatePicker
                            date={
                                data.partnerBirthday
                                    ? new Date(data.partnerBirthday)
                                    : undefined
                            }
                            onDateChange={(date) =>
                                setData((prev) => ({
                                    ...prev,
                                    partnerBirthday: formatDateToLocalString(
                                        date
                                    ) as string,
                                }))
                            }
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
                        <DatePicker
                            date={new Date(data.relationshipStartDate)}
                            onDateChange={(date) =>
                                setData((prev) => ({
                                    ...prev,
                                    relationshipStartDate:
                                        formatDateToLocalString(date) as string,
                                }))
                            }
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
                                src={profilePhotoUrl || '/placeholder.svg'}
                            />
                            <AvatarFallback className='bg-primary/10 text-primary text-lg'>
                                {data.username.charAt(0).toUpperCase()}
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
    );
}
