# core features

- quiz
- results
- user sign up and sign in
    When completing the quiz, the user should be prompted to sign up.This creates a new account and profile. 
    They can log in with their email and password to the dashboard page.
    Their results are now saved in their profile so when they sign in again, they see the "dashboard" page and can navigate to "learn about my type" which takes them to their results from the results page of the quiz.
    
    Enable Email Signup and Verification.
    Save Quiz Results Temporarily (before account creation) and Link to User Account upon Confirmation.
    Redirect Users to the Dashboard after Email Confirmation.
    Display User-Specific Data on the Dashboard.

# session flow
    - User Takes Quiz:
        - Quiz results are saved in quiz_results table with a temporary identifier (temp_id) before they sign up.
        - This allows you to save their progress even if they don’t immediately sign up.
    - User Signs Up (No Email Confirmation) --> redirects to Sign in page
        - A new user is created in auth.users table. 
        - The temporary quiz results are linked to their new user ID.
    - Link Quiz Results to User:
        - When they sign up, check if there are quiz results with their email or temp_id.
        - If found, update those quiz results in quiz_results table with their new user_id.
    - User Logs In and Sees Dashboard:
        - When they log in, query quiz_results by their user_id.
        - Display the relevant quiz results on their dashboard.
        - Any new actions they take are saved under their user_id.

    - On /dashboard, check if the user is logged in.
    - If logged in:
        - Fetch the quiz results using the user_id and email. 
        - Display results and other profile data in dashboard.tsx (this is the user's homepage when they log in)
    - If not logged in:
        - Redirect to the login page.

# when user logs into dashbaord
    - Fetch User Data:
        Get user's dominant_type from quiz_results
        Load relevant user_content based on the user_id and email  
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
