# core features

- quiz
- results
- user sign up and sign in
    When completing the quiz, the user should be prompted to sign up.This creates a new account and profile. 
    users need to confirm via their email address to continue. Once this is done, they are taken to their dashboard page.
    Their results are now saved in their profile (this should be saved in Supabase) so when they sign in again, they see the "dashboard" page and can navigate to "learn about my type" which takes them to their results from the results page of the quiz.
    
    Enable Email Signup and Verification in Supabase.
    Save Quiz Results Temporarily (before account creation) and Link to User Account upon Confirmation.
    Redirect Users to the Dashboard after Email Confirmation.
    Display User-Specific Data on the Dashboard.

# session flow
- User takes the quiz → Results saved with session_id as well as name and email in Supabase
- User signs up → Email confirmation link is sent.-> Link the results to the user once they confirm their email. The user id should be linked to their quiz profile in Supabase.
- User confirms email → Redirected to /dashboard. 
- When the user confirms their email and logs in:
Retrieve the session_id and Update the quiz_profile table to associate the results with the user's user_id:
- On /dashboard, check if the user is logged in.
- If logged in:
    - Fetch the quiz results using the user_id and email. 
    - Display results and other profile data in dashboard.tsx (this is the user's homepage when they log in)
- If not logged in:
    - Redirect to the login page.

# when user logs into dashbaord
    - Fetch User Data:
        Get user's dominant_type from quiz_profile.
        Load relevant user_content based on the user_id
        Load historical ai_conversations.
        Dashboard Personalization: Display:
        Heading: “Welcome back, [user's name]!”
        Custom Content: Based on Enneagram type.
        AI Conversation History: Display past interactions and allow continuity.


- talk with an AI coach that understands your enneagram type from your quiz results
- billing for paid accounts 


# Results page
    - Provide an overview of the Enneagram type, including key characteristics and typical behaviors
    - Brief description of the type.
    - Common behaviors
    - Strengths
    - Core motivations
    - Triggers and Stress Responses
    - How Others Relate to Me: How this type is often perceived by colleagues and direct reports + Potential relational challenges + How they process feedback and conflict


# Welcome to your Lovable project
