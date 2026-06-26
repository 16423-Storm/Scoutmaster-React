# Contributing

Scoutmaster is a project made for the community, and we want to thank you for taking time out of your day to make it a better tool for the community.

# Guidelines

Please take a moment to read these guidelines, as it will make life easier for you, and for everyone else involved with getting your contribution into this project.

## What We are Looking For

We have a wide range of things that you can contribute to this project. Have a look at the [issues tab](https://github.com/16423-Storm/Scoutmaster-React/issues) for bugs already found, or consider anything from this list:

- [Localization](#Localization) (For now, LTR ONLY, no RTL) - Our goal for Scoutmaster is for it to be localized in as many languages as possible, if you know a language that Scoutmaster is not already localized in, consider adding it in yourself!

- [Bug Reports](#How-to-Report-a-Bug) - If you find a bug with our tool that is not already in the [issues tab](https://github.com/16423-Storm/Scoutmaster-React/issues), please consider reporting it. **WARNING, DO NOT REPORT SECURITY BUGS IN THE ISSUES TAB, INSTEAD EMAIL US AT [sdhs_stormbot16423@outlook.com](sdhs_stormbot16423@outlook.com)**

- Bug Fixes - If you see any bugs that you think you can tackle on, feel free to try and find a solution!

- [Suggestions](#How-to-Make-a-Suggestion) - These also go in the [issues tab](https://github.com/16423-Storm/Scoutmaster-React/issues), if you have any ideas for improving Scoutmaster, feel free to suggest them!

- Spelling fixes - If there are any spelling mistakes in the localization files, feel free to make an issue and fix them

## What We are NOT Looking For

Some things are sadly not possible, and they may have already been suggested, these things are listed below:

- None (As of right now)

# Rules

To keep this project at its best quality and function, we need to set some ground rules:

- **ACT WITH GRACIOUS PROFESSIONALISM** - Be kind, and respectful to everyone here, we all humans, we all make mistakes, support those who make mistakes instead of ridiculing them

- **NO AI CONTENT** - All code and content made for this project must be 100% human made, this includes localization files too, they may not be translated by AI

- **NO SPAMMING** - If you have an issue/suggestion, search the [issues tab](https://github.com/16423-Storm/Scoutmaster-React/issues) _BEFORE_ you make a new one to see if it has already been made before by someone else

Now that the behaviour rules are set, there are some other rules related to code:

- **NO CLASSES** - Use functions instead

- **RELAVENT VARIABLE NAMES** - Don't name a boolean "pizza" if it has nothing to do with pizza

- **AVOID "ANY" TYPE** - Pretty much this entire codebase is written in typescript, and typescript forces types onto variables, do not try to get around this by using the any type, there is a reason it enforces types.

- **FOLLOW CSS STRUCTURE** - This is if you write any css, there is a very specific class naming structure, it is: DEVICE-PAGE-SUBPAGE-COMPONENT, this means that a container that is for desktop, on the dashboard page, inside the prescout subpage would be DESKTOP-DASH-PRESCOUT-CONTAINER

- **WRITE JSDOCS** - It doesn't have to be fancy, but a simple, well-written jsdoc makes it very easy to know exactly what a function does, and makes it easier for coders in the future to understand your code

```typescript
/**
 * Clears localstorage
 */
export function clearLocalStorage() {
    localStorage.clear();
}
```

# How to Report a Bug

**SUPER IMPORTANT DISCLIAMER: IF YOU FIND A SECURITY RELATED BUG, DO NOT FOLLOW THE PROCESS BELOW, INSTEAD SEND AN EMAIL TO [sdhs_stormbot16423@outlook.com](sdhs_stormbot16423@outlook.com)**

To report a non-security bug, first, go to the [issues tab](https://github.com/16423-Storm/Scoutmaster-React/issues), and check if anyone else has already reported that bug, if they have, leave a comment that you also have the bug, if not, create a new issue. For your bug report to go smoother, it is a must that you answer these questions at the very top of your issue:

1. What device are you using? (You don't need to specify specific, but think, laptop, desktop, tablet, phone, etc)

2. What browser do you use?

3. What bug did you find?

4. What were you trying to do that the bug interfered with?

5. Is this a repeating issue or one time, if repeating, how often does it repeat?

6. (Optional, but helpful) Any screenshots?

Make sure to label this issue with the bug label

# How to Make a Suggestion

To make a suggestion, simply go to the [issues tab](https://github.com/16423-Storm/Scoutmaster-React/issues) and check if anyone else has made the same suggestion, if so, leave a comment saying you also want this (it will make us put it higher on our priorities), otherwise, make a new issue, and explain what your suggestion is.

Make sure to label this issue with the suggestion label

# Code Review

Our process for reviewing the code you suggest is very simple, you make your pull request, and one of our coders will give you feedback, if it seems good and passes our testing, it will get put into the tool, otherwise, one of our coders will give you feedback on what may be wrong.

# Community

Consider joining [our discord](https://discord.gg/zbTEvwccV) to get update notifications and/or chat with other people that use and contribute to Scoutmaster!

# Localization

Like mentioned earlier, if you know a language that Scoutmaster is not already localized in, first check the [issues tab](https://github.com/16423-Storm/Scoutmaster-React/issues) to see if anyone else is already localizing that language, if not, make an issue with the localization label, then follow the steps below:

_First, before we go on, please understand that right now, Scoutmaster only supports languages that read from left to right, no right to left languages yet..._

1. Create a copy of en.json from Scoutmaster\src\assets\localization\en.json

2. Rename that copy to the [two letter code](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) of that language

3. Replace the English with the language of your choice **DO NOT CHANGE THE KEYS, ONLY THE CONTENT**, for example:

**ENGLISH:**

```json
"cancel": "Cancel",
"continue": "Continue",
```

**FRENCH:**

```json
"cancel": "Annuler",
"continue": "Continuer",
```

4. After this point, you have already done all the hard work, and we can take it from here, but you can even do the last little bit if you like, otherwise, skip to step 9. To start the last little bit, go to Scoutmaster\src\assets\scripts\localization.ts and

5. Add an import for your new json

```typescript
import en from "../localization/en.json";
import fr from "../localization/fr.json";
```

6. Add your language to the supported languages variable

```typescript
const supportedLanguages = ["en", "fr"];
```

7. Add your language to the initialization as well

```typescript
i18n.use(initReactI18next).init({
    lng: defaultLanguage,
    fallbackLng: "en",
    resources: {
        en: { translation: en },
        fr: { translation: fr },
    },
    interpolation: {
        escapeValue: false,
    },
});
```

8. Add your language here too, and add the correct flag emoji for it (this emoji process is causing some issues for us, it may be updated in the future, but for now it is what it is)

```typescript
export const languages = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "fr", label: "FR", flag: "🇫🇷" },
];
```

9. Once you are done, just follow the same process as usual by making a pull request, and it will be read over by one of our coders, if approved, it will be put in.

# Thank You

Thank you for taking the time to read our guidelines, and an extra thank you if you do choose to contribute.
