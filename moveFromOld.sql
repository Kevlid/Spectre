INSERT INTO kattdev.activity_voice (
    guild_id,
    user_id,
    user_name,
    total_seconds,
    daily_seconds,
    weekly_seconds,
    monthly_seconds,
    last_update
)
SELECT
    guild_id,
    user_id,
    user_name,
    seconds AS total_seconds,
    0 AS daily_seconds,
    0 AS weekly_seconds,
    0 AS monthly_seconds,
    NOW() AS last_update
FROM iwek.voice_activity;

INSERT INTO kattdev.activity_messages (
    guild_id,
    user_id,
    user_name,
    total_messages,
    daily_messages,
    weekly_messages,
    monthly_messages,
    last_update
)
SELECT
    guild_id,
    user_id,
    user_name,
    amount AS total_messages,
    0 AS daily_messages,
    0 AS weekly_messages,
    0 AS monthly_messages,
    NOW() AS last_update
FROM iwek.message_activity;