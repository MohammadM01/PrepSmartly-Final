import supabase from '../supabaseClient.js';

export const signup = async (req, res) => {
    let { email, password, name } = req.body;

    // Sanitize input
    email = email?.trim();
    password = password?.trim();
    name = name?.trim();

    console.log("Signup attempt for:", email);

    try {
        // Create user using admin API (requires service role key)
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            user_metadata: {
                full_name: name,
            },
            email_confirm: true // Auto-confirm the user's email
        });

        if (error) {
            console.error("Supabase Admin CreateUser Error:", error);
            return res.status(400).json({ error: error.message });
        }

        if (data.user) {
            // Insert into public.users table
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        id: data.user.id,
                        email: email,
                        display_name: name,
                        created_at: new Date().toISOString(),
                        user_uid: data.user.id
                    }
                ]);

            if (insertError) {
                console.error("Error inserting into users table:", insertError);
            }
        }

        // Return session if possible, but admin.createUser doesn't return a session by default.
        // We might need to sign in the user to get a session, or just return the user and ask them to sign in.
        // However, for better UX, let's try to sign them in immediately.

        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            // If sign in fails (unlikely if creation succeeded), return user but no session
            return res.status(201).json({ message: 'User created, please sign in', user: data.user });
        }

        res.status(201).json({ message: 'User created successfully', user: data.user, session: signInData.session });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({ error: error.message });
        }

        // Fetch user details from public.users table
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            console.error("Error fetching user profile:", profileError);
        }

        // Combine auth user and profile data
        const user = {
            ...data.user,
            user_metadata: {
                ...data.user.user_metadata,
                ...userProfile // Merge profile data into metadata for frontend compatibility
            }
        };

        res.status(200).json({ message: 'Login successful', user: user, session: data.session });
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:5173/reset-password', // Update with your frontend URL
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ message: 'Password reset email sent', data });
    } catch (err) {
        console.error("Forgot Password error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const googleSignIn = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:5173/dashboard', // Redirect to dashboard after login
            },
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({ url: data.url });
    } catch (err) {
        console.error("Google Sign In error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
