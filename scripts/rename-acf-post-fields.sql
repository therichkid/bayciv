DROP TEMPORARY TABLE IF EXISTS acf_field_renames;
CREATE TEMPORARY TABLE acf_field_renames (
    old_name VARCHAR(191) NOT NULL,
    new_name VARCHAR(191) NOT NULL
);
INSERT INTO acf_field_renames (old_name, new_name) VALUES
    ('typ', 'facility_type'),
    ('ausgabe', 'issue'),
    ('beiträge', 'linked_posts');

SELECT r.old_name, r.new_name, m.post_id, p.post_type, m.meta_key, m.meta_value
FROM acf_field_renames AS r
JOIN bayciv_postmeta AS m ON m.meta_key IN (r.old_name, CONCAT('_', r.old_name),
                                        r.new_name, CONCAT('_', r.new_name))
LEFT JOIN bayciv_posts AS p ON p.ID = m.post_id
ORDER BY r.old_name, m.post_id, m.meta_key;

START TRANSACTION;

UPDATE bayciv_postmeta AS m
JOIN acf_field_renames AS r ON m.meta_key IN (r.old_name, CONCAT('_', r.old_name))
SET m.meta_key = CASE
    WHEN m.meta_key = r.old_name THEN r.new_name
    ELSE CONCAT('_', r.new_name)
END;

SELECT ROW_COUNT() AS updated_rows;
SELECT r.old_name, r.new_name, m.post_id, p.post_type, m.meta_key, m.meta_value
FROM acf_field_renames AS r
JOIN bayciv_postmeta AS m ON m.meta_key IN (r.new_name, CONCAT('_', r.new_name))
LEFT JOIN bayciv_posts AS p ON p.ID = m.post_id
ORDER BY r.old_name, m.post_id, m.meta_key;

-- Default: undo the update. Replace with COMMIT only after reviewing results.
ROLLBACK;
