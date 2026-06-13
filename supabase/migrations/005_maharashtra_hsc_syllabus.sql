-- Maharashtra State Board Class 12 Commerce subjects and chapters.
insert into public.subjects (name, description)
values
  ('Accountancy', 'Maharashtra HSC Class 12 Book Keeping and Accountancy.'),
  ('Economics', 'Maharashtra HSC Class 12 Economics.'),
  ('OCM', 'Maharashtra HSC Class 12 Organisation of Commerce and Management.'),
  ('English', 'Maharashtra HSC Class 12 English.'),
  ('Statistics', 'Statistics resources for Commerce students.'),
  ('Mathematics', 'Optional Mathematics resources for Commerce students.')
on conflict (name) do update set description = excluded.description;

with subject_rows as (
  select id, name from public.subjects
),
chapter_rows as (
  select 'Accountancy' as subject_name, 1 as chapter_number, 'Introduction to Partnership' as title union all
  select 'Accountancy', 2, 'Partnership Final Accounts' union all
  select 'Accountancy', 3, 'Reconstitution of Partnership' union all
  select 'Accountancy', 4, 'Dissolution of Partnership Firm' union all
  select 'Accountancy', 5, 'Accounts of ''Not for Profit'' Concerns' union all
  select 'Accountancy', 6, 'Single Entry System' union all
  select 'Accountancy', 7, 'Bill of Exchange' union all
  select 'Accountancy', 8, 'Company Accounts' union all
  select 'Accountancy', 9, 'Analysis of Financial Statements' union all
  select 'Economics', 1, 'Introduction to Microeconomics' union all
  select 'Economics', 2, 'Consumer Behaviour' union all
  select 'Economics', 3, 'Analysis of Demand, Elasticity of Demand' union all
  select 'Economics', 4, 'Analysis of Supply' union all
  select 'Economics', 5, 'Types of Market and Price Determination' union all
  select 'Economics', 6, 'Factors of Production' union all
  select 'Economics', 7, 'Introduction to Macroeconomics' union all
  select 'Economics', 8, 'National Income' union all
  select 'Economics', 9, 'Determinates of Aggregates' union all
  select 'Economics', 10, 'Money' union all
  select 'Economics', 11, 'Commercial Banks' union all
  select 'Economics', 12, 'Central Banks' union all
  select 'Economics', 13, 'Public Economics' union all
  select 'OCM', 1, 'Principles of Management' union all
  select 'OCM', 2, 'Functions of Management' union all
  select 'OCM', 3, 'Business Environment' union all
  select 'OCM', 4, 'Entrepreneurship Development' union all
  select 'OCM', 5, 'Emerging Modes of Business' union all
  select 'OCM', 6, 'Social Responsibilities of Business and Business Ethics' union all
  select 'OCM', 7, 'Consumer Protection' union all
  select 'OCM', 8, 'Marketing' union all
  select 'English', 1, 'Section One (Prose)' union all
  select 'English', 2, 'Section Two (Poetry)' union all
  select 'English', 3, 'Section Three (Writing Skills)' union all
  select 'English', 4, 'Section Four (Drama)' union all
  select 'English', 5, 'Grammar and Vocabulary' union all
  select 'English', 6, 'Listening, Speaking, Reading Skills'
)
insert into public.chapters (subject_id, chapter_number, title)
select subject_rows.id, chapter_rows.chapter_number, chapter_rows.title
from chapter_rows
join subject_rows on subject_rows.name = chapter_rows.subject_name
on conflict (subject_id, chapter_number) do update set title = excluded.title;
