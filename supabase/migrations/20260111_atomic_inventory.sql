-- ==============================================================
-- Atomic Inventory Decrement Function for ChameleonCommerceOS
-- Run this in your Supabase SQL Editor
-- ==============================================================

-- Function to atomically decrement stock and prevent overselling
-- Called by the Stripe webhook after payment succeeds

CREATE OR REPLACE FUNCTION decrement_stock(order_items jsonb)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    item jsonb;
    product_id_val uuid;
    quantity_val int;
    current_stock int;
BEGIN
    -- Loop through each item in the order
    FOR item IN SELECT * FROM jsonb_array_elements(order_items)
    LOOP
        product_id_val := (item->>'product_id')::uuid;
        quantity_val := (item->>'quantity')::int;

        -- Atomic update with stock check
        -- This uses a row-level lock to prevent race conditions
        UPDATE products
        SET inventory_quantity = inventory_quantity - quantity_val
        WHERE id = product_id_val
          AND inventory_quantity >= quantity_val;

        -- Check if the update actually happened
        IF NOT FOUND THEN
            -- Get current stock for error message
            SELECT inventory_quantity INTO current_stock
            FROM products WHERE id = product_id_val;

            -- Rollback the entire transaction
            RAISE EXCEPTION 'Insufficient stock for product %. Requested: %, Available: %',
                product_id_val, quantity_val, COALESCE(current_stock, 0);
        END IF;
    END LOOP;
END;
$$;

-- Grant execute permission to authenticated users (or service role)
GRANT EXECUTE ON FUNCTION decrement_stock(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_stock(jsonb) TO service_role;

-- ==============================================================
-- Instructions:
-- 1. Go to Supabase Dashboard -> SQL Editor
-- 2. Paste this entire file
-- 3. Click "Run"
-- 4. You should see "Success. No rows returned"
-- ==============================================================
