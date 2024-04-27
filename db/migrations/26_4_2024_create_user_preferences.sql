-- up
CREATE TABLE userPreferences(
    userId TEXT NOT NULL,
    languageLevel TEXT NOT NULL,
    objectives TEXT NOT NULL,
    commitment TEXT NOT NULL
);
-- DOWN
DROP INDEX userPreferences;
