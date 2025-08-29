-- Insert sample learning modules
INSERT INTO public.learning_modules (title, description, content, category, difficulty_level, estimated_duration, tags, is_published) VALUES
('Introduction to Freelancing', 'Learn the basics of starting your freelance career', 'Complete guide to freelancing including finding clients, setting rates, and managing projects.', 'entrepreneurship', 2, 45, ARRAY['freelance', 'business', 'income'], true),
('Basic Financial Literacy', 'Understanding money management and savings', 'Learn about budgeting, saving, investing, and making smart financial decisions.', 'finance', 1, 30, ARRAY['money', 'savings', 'budget'], true),
('Digital Marketing Basics', 'Introduction to marketing your business online', 'Learn about social media marketing, SEO, and online advertising.', 'marketing', 2, 60, ARRAY['marketing', 'digital', 'social media'], true),
('CV Writing Mastery', 'Create compelling CVs that get noticed', 'Step-by-step guide to writing professional CVs that stand out to employers.', 'career', 1, 25, ARRAY['cv', 'resume', 'job search'], true),
('Interview Skills Workshop', 'Master the art of job interviews', 'Learn how to prepare for, conduct, and follow up on job interviews.', 'career', 2, 40, ARRAY['interview', 'communication', 'jobs'], true);

-- Insert sample job opportunities
INSERT INTO public.job_opportunities (title, company, description, requirements, skills_required, location, salary_range, employment_type, application_url, expires_at) VALUES
('Junior Software Developer', 'TechStart Tanzania', 'Join our growing team of developers to build innovative solutions for African markets.', ARRAY['Form 6 or equivalent', 'Basic programming knowledge', 'Willingness to learn'], ARRAY['JavaScript', 'Python', 'Problem solving'], 'Dar es Salaam', 'TZS 800,000 - 1,200,000', 'full_time', 'https://techstart.tz/careers', NOW() + INTERVAL '30 days'),
('Digital Marketing Intern', 'Creative Agency Ltd', 'Learn digital marketing while working on real client projects.', ARRAY['Form 4 or above', 'Social media savvy', 'Creative thinking'], ARRAY['Social Media', 'Content Creation', 'Analytics'], 'Dar es Salaam', 'TZS 300,000 - 500,000', 'internship', 'https://creative-agency.co.tz/apply', NOW() + INTERVAL '21 days'),
('Customer Service Representative', 'M-Pesa Tanzania', 'Help customers with mobile money services and financial solutions.', ARRAY['Form 4 certificate', 'Good communication skills', 'Customer service experience preferred'], ARRAY['Communication', 'Problem solving', 'Swahili & English'], 'Multiple locations', 'TZS 600,000 - 800,000', 'full_time', 'https://vodacom.co.tz/careers', NOW() + INTERVAL '14 days'),
('Agricultural Extension Officer', 'AgriTech Solutions', 'Work with smallholder farmers to improve agricultural productivity.', ARRAY['Diploma in Agriculture', 'Field experience', 'Motorcycle license'], ARRAY['Agriculture', 'Training', 'Data collection'], 'Mbeya Region', 'TZS 700,000 - 900,000', 'full_time', 'https://agritech.tz/jobs', NOW() + INTERVAL '45 days'),
('Graphic Design Freelancer', 'Multiple Clients', 'Create visual content for various businesses and organizations.', ARRAY['Portfolio of work', 'Design software knowledge', 'Self-motivated'], ARRAY['Adobe Creative Suite', 'Branding', 'Print Design'], 'Remote/Dar es Salaam', 'TZS 50,000 - 200,000 per project', 'contract', 'https://freelance.tz/register', NOW() + INTERVAL '60 days');

-- Insert sample partners
INSERT INTO public.partners (name, logo_url, description, website, contact_email, partnership_type, is_active) VALUES
('Vodacom Foundation', '/placeholder-logo.png', 'Leading telecommunications company supporting youth development programs.', 'https://vodacom.co.tz', 'foundation@vodacom.co.tz', ARRAY['technology', 'education'], true),
('Tanzania Development Finance Company', '/placeholder-logo.png', 'Providing financial services and support for youth entrepreneurship.', 'https://tdfc.co.tz', 'info@tdfc.co.tz', ARRAY['finance', 'entrepreneurship'], true),
('USAID Tanzania', '/placeholder-logo.png', 'Supporting education and economic development initiatives.', 'https://usaid.gov/tanzania', 'info@usaid.gov', ARRAY['education', 'development'], true),
('Microsoft Tanzania', '/placeholder-logo.png', 'Technology training and digital skills development programs.', 'https://microsoft.com/tanzania', 'tanzania@microsoft.com', ARRAY['technology', 'training'], true),
('National Institute of Technology', '/placeholder-logo.png', 'Technical and vocational education training provider.', 'https://nit.ac.tz', 'info@nit.ac.tz', ARRAY['education', 'technical'], true),
('Tanzania Youth Chamber of Commerce', '/placeholder-logo.png', 'Supporting young entrepreneurs and business development.', 'https://tycc.or.tz', 'info@tycc.or.tz', ARRAY['business', 'entrepreneurship'], true);

-- Insert system settings
INSERT INTO public.system_settings (key, value, description) VALUES
('platform_name', '"Career na Mimi"', 'Name of the platform'),
('default_reminder_frequency', '"daily"', 'Default reminder frequency for new users'),
('ai_personality_prompts', '{"prompts": ["logical", "creative", "analytical", "people-focused"]}', 'AI personality assessment prompts'),
('supported_languages', '["English", "Swahili"]', 'Languages supported by the platform'),
('max_cv_count_per_user', '5', 'Maximum number of CVs a user can create'),
('mentorship_session_duration', '60', 'Default mentorship session duration in minutes');