----------------------------------------
-- cache_times
----------------------------------------
CREATE TABLE cache_times (
  cache_time_id SERIAL PRIMARY KEY,
  table_name VARCHAR(255),
  cached_at_utc TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
)
