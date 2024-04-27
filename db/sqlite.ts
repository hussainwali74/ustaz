import sqlite3 from "sqlite3";
import { open, Database } from 'sqlite'
let db: Database;
export const openDb = async () => {

    return await open({
        filename: './db/database.db',
        driver: sqlite3.Database
    })

}

export interface userPreferencesInterface {
    userId?: string,
    languageLevel: string,
    objectives: string,
    commitment: string
}

export const savePreferences = async (preferences_data: userPreferencesInterface) => {
    try {

        db = await openDb()
        const stmt = await db.prepare('INSERT INTO userPreferences (userId, languageLevel, objectives, commitment) VALUES (?,?,?,?)')

        console.log('-----------------------------------------------------')
        console.log(`stmt :>>`, stmt)
        console.log(`preferences_data :>>`, preferences_data)
        console.log('-----------------------------------------------------')

        const result = await stmt.run(
            preferences_data.userId,
            preferences_data.languageLevel,
            preferences_data.objectives,
            preferences_data.commitment
        )

        await stmt.finalize()
        return result
    } catch (error) {
        console.log('-----------------------------------------------------')
        console.log(`error saving userpreferences 36 :>>`, error)
        console.log('-----------------------------------------------------')
    } finally {
        db.close()
    }
}

export const getPreferences = async (userId: string) => {
    try {

        db = await openDb()
        const stmt = await db.prepare('SELECT * FROM userPreferences WHERE userId=?')
        const result = await stmt.get(userId)

        console.log('-----------------------------------------------------')
        console.log(`result getPreferences :>>`, result)
        console.log(`userId :>>`, userId)
        console.log('-----------------------------------------------------')

        await stmt.finalize()
        return result
    } catch (error) {
        console.log('-----------------------------------------------------')
        console.log(`error getting userpreferences 36 :>>`, error)
        console.log('-----------------------------------------------------')
    } finally {
        db.close()
    }
}

