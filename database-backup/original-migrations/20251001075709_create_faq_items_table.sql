/*
  # Create FAQ items table

  1. New Tables
    - `faq_items`
      - `id` (uuid, primary key)
      - `question` (text, not null) - FAQ question
      - `answer` (text, not null) - FAQ answer
      - `order_index` (integer, default 0) - Display order
      - `is_active` (boolean, default true) - Active status
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `faq_items` table
    - Add policies for authenticated users to manage FAQ items
    - Add policy for public read access to active FAQs

  3. Indexes
    - Index on is_active for filtering
    - Index on order_index for sorting
*/

-- Create faq_items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to active FAQs
CREATE POLICY "Active FAQ items are viewable by everyone"
  ON faq_items
  FOR SELECT
  TO public
  USING (is_active = true);

-- Create policies for authenticated users to manage FAQ items
CREATE POLICY "Authenticated users can view all FAQ items"
  ON faq_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert FAQ items"
  ON faq_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update FAQ items"
  ON faq_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete FAQ items"
  ON faq_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS faq_items_is_active_idx ON faq_items(is_active);
CREATE INDEX IF NOT EXISTS faq_items_order_index_idx ON faq_items(order_index);

-- Insert sample FAQ items
INSERT INTO faq_items (question, answer, order_index) VALUES
  ('What types of fencing do you offer?', 'We offer timber, aluminum, PVC/vinyl, and rural fencing solutions tailored to residential and lifestyle properties across the Waikato region.', 1),
  ('Do you provide free quotes?', 'Yes, we provide free, no-obligation quotes for all fencing projects. Use our online calculator for an instant estimate or contact us for a detailed quote.', 2),
  ('How long does installation take?', 'Installation time depends on the project size and fence type. Typical residential fencing projects take 1-3 days to complete.', 3),
  ('What areas do you service?', 'We service Hamilton, Cambridge, Te Awamutu, and the wider Waikato region. Contact us to confirm we cover your area.', 4),
  ('Do you offer warranties?', 'Yes, we stand behind our work with comprehensive warranties on both materials and workmanship. Specific warranty terms vary by fence type.', 5),
  ('Can you handle council consent requirements?', 'Yes, we can assist with council consent applications where required. We''re familiar with local council requirements across the Waikato region.', 6)
ON CONFLICT DO NOTHING;