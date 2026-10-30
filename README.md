<p align="center">
  <img fill="currentColor" src="Scoutmaster\src\assets\images\branding\logobanner.svg" alt="Banner Logo">
</p>

---

# What Is Scoutmaster?

Scoutmaster is a revolutionary First Tech Challenge scouting tool developed by FTC Team #16423. It is jam-packed with features that will help your team compete better and stronger at all your competitions.

## Features

- Compatible with all devices!
- Realtime syncing across all devices!
- Prescout teams before matches to figure out unique details about each team!
- Scout matches to know <u>_EXACTLY_</u> how many points each team scores!
- Get a summary afterwards of that data to help with alliance selection!

## Why We Made It

Originally it started as an end of season project in the Into The Deep season in 2024. We had lots of issues with paper scouting, and wanted to fix them. We didn't find scouting tools that had everything we needed so we made a prototype online tool for our team to use. After we saw how useful it was, we decided to put in the work to add a proper account system and teams system and then we made it public!

## How We Made It

The original Scoutmaster was coded in raw HTML, and used Supabase as the backend database. We found that while this worked, it had a lot of issues, such as for technical reasons we had to lock a team after they were scouted, meaning if someone made a mistake, they would have to reset the entire competition. When anyone made a change, for it to sync, we had to make it so the entire portion had to be reloaded from the database (e.g. if someone scouted one match, all the other users had to reload the entire match scouting portion). This time around, we wanted to make sure that the tool was frictionless, and instant syncing. We knew that this was only possible with realtime synchronization. We decided to take what we learned from our other project we made for robotics, [Botbay](https://www.botbay.dev) and use a Python server to make it so any time a user made a change, it would send a signal to all other users to make the same change, while also telling the database to save the change.

### New Things We Added

We added on a lot of new things even while using existing systems we learned, these include:
* Strict schema enforcement
* Rate limits
* Proper CORS
* Optimization of realtime messages to make them smaller and put less load on the server
