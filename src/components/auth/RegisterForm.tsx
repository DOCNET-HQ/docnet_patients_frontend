'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRegisterMutation } from "@/lib/api/apiSlice"
import { useAppDispatch } from "@/hooks/redux"
import { setCredentials } from "@/lib/store/slices/authSlice"
import { Eye, EyeOff, Loader2, ChevronDown, Search } from "lucide-react"

interface Country {
    name: string
    capital: string
}

interface State {
    name: string
}

interface FormData {
    name: string
    country: string
    state: string
    city: string
    phone_number: string
    password: string
    email: string
}

interface FormErrors {
    name?: string
    country?: string
    state?: string
    city?: string
    phone_number?: string
    password?: string
    email?: string
    general?: string
}

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        country: '',
        state: '',
        city: '',
        phone_number: '',
        password: '',
        email: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})

    // Country and state data
    const [countries, setCountries] = useState<Country[]>([])
    const [states, setStates] = useState<State[]>([])
    const [loadingCountries, setLoadingCountries] = useState(false)
    const [loadingStates, setLoadingStates] = useState(false)
    const [countryError, setCountryError] = useState('')
    const [stateError, setStateError] = useState('')

    // Autocomplete states
    const [countrySearch, setCountrySearch] = useState('')
    const [stateSearch, setStateSearch] = useState('')
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)
    const [showStateDropdown, setShowStateDropdown] = useState(false)
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
    const [filteredStates, setFilteredStates] = useState<State[]>([])

    // Refs for dropdown management
    const countryDropdownRef = useRef<HTMLDivElement>(null)
    const stateDropdownRef = useRef<HTMLDivElement>(null)

    const [register, { isLoading }] = useRegisterMutation()
    const dispatch = useAppDispatch()
    const router = useRouter()

    // Fetch countries from API
    const fetchCountries = async () => {
        setLoadingCountries(true)
        setCountryError('')
        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/capital')
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            const data = await response.json()
            if (data.error) {
                throw new Error(data.msg || 'Failed to load countries')
            }
            // Sort countries alphabetically
            const sortedCountries = data.data.sort((a: Country, b: Country) =>
                a.name.localeCompare(b.name)
            )
            setCountries(sortedCountries)
            setFilteredCountries(sortedCountries)
        } catch (error) {
            console.error('Error fetching countries:', error)
            setCountryError('Failed to load countries. Please try again later.')
        } finally {
            setLoadingCountries(false)
        }
    }

    // Fetch states for a selected country
    const fetchStates = async (country: string) => {
        if (!country) return
        setLoadingStates(true)
        setStateError('')
        setStates([])
        setFilteredStates([])
        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ country }),
            })
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            const data = await response.json()
            if (data.error) {
                throw new Error(data.msg || `Failed to load states for ${country}`)
            }
            // Sort states alphabetically
            const sortedStates = data.data.states.sort((a: State, b: State) =>
                a.name.localeCompare(b.name)
            )
            setStates(sortedStates)
            setFilteredStates(sortedStates)
        } catch (error) {
            console.error(`Error fetching states for ${country}:`, error)
            setStateError(`Failed to load states for ${country}. Please try again later.`)
        } finally {
            setLoadingStates(false)
        }
    }

    // Load countries on component mount
    useEffect(() => {
        fetchCountries()
    }, [])

    // Filter countries based on search
    useEffect(() => {
        if (!countrySearch.trim()) {
            setFilteredCountries(countries)
        } else {
            const filtered = countries.filter(country =>
                country.name.toLowerCase().includes(countrySearch.toLowerCase())
            )
            setFilteredCountries(filtered)
        }
    }, [countrySearch, countries])

    // Filter states based on search
    useEffect(() => {
        if (!stateSearch.trim()) {
            setFilteredStates(states)
        } else {
            const filtered = states.filter(state =>
                state.name.toLowerCase().includes(stateSearch.toLowerCase())
            )
            setFilteredStates(filtered)
        }
    }, [stateSearch, states])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
                setShowCountryDropdown(false)
            }
            if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
                setShowStateDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handle country selection
    const handleCountrySelect = (country: string) => {
        setFormData(prev => ({
            ...prev,
            country,
            state: '', // Reset state when country changes
        }))
        setCountrySearch(country)
        setStateSearch('')
        setShowCountryDropdown(false)
        fetchStates(country)

        // Clear error when user selects
        if (errors.country) {
            setErrors(prev => ({ ...prev, country: undefined }))
        }
    }

    // Handle state selection
    const handleStateSelect = (state: string) => {
        setFormData(prev => ({
            ...prev,
            state
        }))
        setStateSearch(state)
        setShowStateDropdown(false)
    }

    // Handle input changes
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) newErrors.name = 'Patient name is required'
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required'
        } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Please enter a valid phone number'
        }
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long'
        }
        if (!formData.country) newErrors.country = 'Please select a country'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        if (!validateForm()) return

        try {
            const result = await register(formData).unwrap()

            // Store auth data in Redux (if registration returns auth data)
            if (result.user && result.access && result.refresh) {
                dispatch(
                    setCredentials({
                        user: result.user,
                        token: result.access,
                        refreshToken: result.refresh,
                    })
                )
                router.push('/')
            } else {
                // If registration doesn't auto-login, redirect to verify account
                router.push('/auth/verify-account?message=Registration successful. Please verify your email.')
            }
        } catch (error: unknown) {
            console.log(error);

            if (typeof error === "object" && error !== null && "data" in error) {
                const err = error as {
                    data?: {
                        name?: string;
                        email?: string;
                        phone_number?: string;
                        password?: string;
                        country?: string;
                        message?: string;
                    };
                };

                setErrors({
                    name: err.data?.name,
                    email: err.data?.email,
                    phone_number: err.data?.phone_number,
                    password: err.data?.password,
                    country: err.data?.country,
                    general:
                        (!err.data?.name &&
                        !err.data?.email &&
                        !err.data?.phone_number &&
                        !err.data?.password &&
                        !err.data?.country)
                            ? (err.data?.message || "Registration failed. Please try again.")
                            : undefined,
                });
            } else {
                setErrors({
                    name: undefined,
                    email: undefined,
                    phone_number: undefined,
                    password: undefined,
                    country: undefined,
                    general: "Registration failed. Please try again.",
                });
            }
        }
    }

    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Register your patient to get started
                </p>
            </div>

            {errors.general && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
                    {errors.general}
                </div>
            )}

            <div className="grid gap-6">
                {/* Patient Name */}
                <div className="grid gap-3">
                    <Label htmlFor="name" className="text-foreground">
                        Patient Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Light Patient"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={cn(
                            "bg-background text-foreground border-input",
                            errors.name ? "border-red-500 dark:border-red-400" : ""
                        )}
                        disabled={isLoading}
                        required
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="grid gap-3">
                    <Label htmlFor="email" className="text-foreground">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="patient@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={cn(
                            "bg-background text-foreground border-input",
                            errors.email ? "border-red-500 dark:border-red-400" : ""
                        )}
                        disabled={isLoading}
                        required
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="grid gap-3">
                    <Label htmlFor="phone_number" className="text-foreground">
                        Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="phone_number"
                        type="tel"
                        placeholder="+250792525545"
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        className={cn(
                            "bg-background text-foreground border-input",
                            errors.phone_number ? "border-red-500 dark:border-red-400" : ""
                        )}
                        disabled={isLoading}
                        required
                    />
                    {errors.phone_number && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.phone_number}</p>
                    )}
                </div>

                {/* Country Autocomplete */}
                <div className="grid gap-3">
                    <Label htmlFor="country" className="text-foreground">
                        Country <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative w-full" ref={countryDropdownRef}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="country"
                                type="text"
                                placeholder={loadingCountries ? "Loading countries..." : "Search and select a country"}
                                value={countrySearch}
                                onChange={(e) => {
                                    setCountrySearch(e.target.value)
                                    setShowCountryDropdown(true)
                                }}
                                onFocus={() => setShowCountryDropdown(true)}
                                className={cn(
                                    "bg-background text-foreground border-input w-full pl-10 pr-10",
                                    errors.country ? "border-red-500 dark:border-red-400" : ""
                                )}
                                disabled={isLoading || loadingCountries}
                            />
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        </div>

                        {showCountryDropdown && filteredCountries.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                                {filteredCountries.map((country) => (
                                    <div
                                        key={country.name}
                                        className="px-3 py-2 cursor-pointer hover:bg-muted transition-colors text-foreground"
                                        onClick={() => handleCountrySelect(country.name)}
                                    >
                                        {country.name}
                                    </div>
                                ))}
                            </div>
                        )}

                        {showCountryDropdown && filteredCountries.length === 0 && countrySearch && !loadingCountries && (
                            <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
                                <div className="px-3 py-2 text-muted-foreground">
                                    No countries found
                                </div>
                            </div>
                        )}
                    </div>
                    {countryError && (
                        <p className="text-sm text-red-600 dark:text-red-400">{countryError}</p>
                    )}
                    {errors.country && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.country}</p>
                    )}
                </div>

                {/* State Autocomplete */}
                <div className="grid gap-3">
                    <Label htmlFor="state" className="text-foreground">State/Province</Label>
                    <div className="relative w-full" ref={stateDropdownRef}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="state"
                                type="text"
                                placeholder={
                                    !formData.country ? "Select a country first" :
                                        loadingStates ? "Loading states..." :
                                            states.length === 0 ? "No states available" :
                                                "Search and select a state"
                                }
                                value={stateSearch}
                                onChange={(e) => {
                                    setStateSearch(e.target.value)
                                    setShowStateDropdown(true)
                                }}
                                onFocus={() => formData.country && states.length > 0 && setShowStateDropdown(true)}
                                className="bg-background text-foreground border-input w-full pl-10 pr-10"
                                disabled={isLoading || loadingStates || !formData.country || states.length === 0}
                            />
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        </div>

                        {showStateDropdown && filteredStates.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                                {filteredStates.map((state) => (
                                    <div
                                        key={state.name}
                                        className="px-3 py-2 cursor-pointer hover:bg-muted transition-colors text-foreground"
                                        onClick={() => handleStateSelect(state.name)}
                                    >
                                        {state.name}
                                    </div>
                                ))}
                            </div>
                        )}

                        {showStateDropdown && filteredStates.length === 0 && stateSearch && !loadingStates && formData.country && (
                            <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
                                <div className="px-3 py-2 text-muted-foreground">
                                    No states found
                                </div>
                            </div>
                        )}
                    </div>
                    {stateError && (
                        <p className="text-sm text-red-600 dark:text-red-400">{stateError}</p>
                    )}
                </div>

                {/* City */}
                <div className="grid gap-3">
                    <Label htmlFor="city" className="text-foreground">City</Label>
                    <Input
                        id="city"
                        type="text"
                        placeholder="Nyarutarama"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="bg-background text-foreground border-input"
                        disabled={isLoading}
                    />
                </div>

                {/* Password */}
                <div className="grid gap-3">
                    <Label htmlFor="password" className="text-foreground">
                        Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={cn(
                                "bg-background text-foreground border-input pr-10",
                                errors.password ? "border-red-500 dark:border-red-400" : ""
                            )}
                            disabled={isLoading}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white transition-colors bg-blue-600 cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/auth/login"
                    className="text-xs underline underline-offset-4 text-blue-600 transition-colors"
                >
                    Sign in
                </Link>
            </div>
        </form>
    )
}
