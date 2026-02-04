module.exports = {

"[project]/apps/profile-dashboard/lib/dal/profile-dal.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getProfileData": (()=>getProfileData),
    "getRegistrations": (()=>getRegistrations),
    "getUserApplications": (()=>getUserApplications)
});
const profiledata = {
    response: {
        refreshToken: "5RGf9LvhX8nq33Eb-DnWAlmQd5buFFUR-TLR1sicX0YeOBvsCXXhhQ",
        refreshTokenId: "e3c9de16-dce9-49c7-9572-7305ee48e69e",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijk4NjgzZGY5MiJ9.eyJhdWQiOiI3NzZhY2Q3NC0xOWQzLTRiZTktOTE4MC1iMGM3OThmNWM3YzQiLCJleHAiOjE3NTA2ODc3NDksImlhdCI6MTc1MDY4NDE0OSwiaXNzIjoidGhpbmsubmV0Iiwic3ViIjoiMTY3YTcyYTQtNjIxMi00YWQ0LWJlYjEtNzIyNjVhZjc3OTdlIiwianRpIjoiNDMyNzQ0MDktZjYwMy00NjQ3LTgzMmUtYTQ0YzE0ZTIyOWY4IiwiYXV0aGVudGljYXRpb25UeXBlIjoiUEFTU1dPUkQiLCJhcHBsaWNhdGlvbklkIjoiNzc2YWNkNzQtMTlkMy00YmU5LTkxODAtYjBjNzk4ZjVjN2M0Iiwicm9sZXMiOlsiYWRtaW4iXSwic2lkIjoiZTNjOWRlMTYtZGNlOS00OWM3LTk1NzItNzMwNWVlNDhlNjllIiwiYXV0aF90aW1lIjoxNzUwNjg0MTQ5LCJ0aWQiOiIwZjE5Mzg5Zi1kYmQxLTQ4NTMtYWIwZi0zM2ZjZDJhYzFlZDAifQ.QIfmeARsW-FwXGzuOLPokJHxsHgBr4dzWuqYTNKn-g8",
        tokenExpirationInstant: 1750687749873,
        user: {
            active: true,
            birthDate: "1976-05-30",
            connectorId: "e3306678-a53a-4964-9040-1c96f36dda72",
            data: {
                'profession': {
                    'title': [
                        "software engineer"
                    ],
                    "skill": []
                },
                'role': [
                    'Member'
                ],
                'bio': "John Doe is a software engineer with over 10 years of experience in web development. He enjoys coding, hiking, and photography.",
                'location': {
                    "town": "Denver, CO"
                }
            },
            email: "paulpennuel@fusionauth.io",
            firstName: "John",
            id: "167a72a4-6212-4ad4-beb1-72265af7797e",
            insertInstant: 1748411698619,
            lastLoginInstant: 1750684149854,
            lastName: "Doe",
            lastUpdateInstant: 1748411698619,
            memberships: [],
            mobilePhone: "303-555-1234",
            passwordChangeRequired: false,
            passwordLastUpdateInstant: 1748411698683,
            preferredLanguages: [
                'english',
                'spanish'
            ],
            registrations: [
                {
                    applicationId: "776acd74-19d3-4be9-9180-b0c798f5c7c4",
                    data: {},
                    id: "4485c89f-1f32-475a-91a0-7a5fc0bc71f5",
                    insertInstant: 1748538163689,
                    lastLoginInstant: 1750684149854,
                    lastUpdateInstant: 1748548862316,
                    preferredLanguages: [],
                    roles: [
                        "admin"
                    ],
                    tokens: {},
                    usernameStatus: "ACTIVE",
                    verified: true,
                    verifiedInstant: 1748538163689
                },
                {
                    applicationId: "132d4c65-8205-40a3-bd4c-a81015f236af",
                    data: {
                        "5b923330-ad30-4988-9c00-fe8737791949": {
                            data: {},
                            group_id: "5b923330-ad30-4988-9c00-fe8737791949",
                            role: [
                                "member"
                            ]
                        }
                    },
                    id: "dec0db89-4150-484e-a670-44d3a550c063",
                    insertInstant: 1748411698693,
                    lastLoginInstant: 1749630400816,
                    lastUpdateInstant: 1749630412727,
                    preferredLanguages: [],
                    roles: [
                        "practitioner",
                        "user"
                    ],
                    tokens: {},
                    usernameStatus: "ACTIVE",
                    verified: true,
                    verifiedInstant: 1748411698693
                }
            ],
            tenantId: "0f19389f-dbd1-4853-ab0f-33fcd2ac1ed0",
            twoFactor: {
                methods: [],
                recoveryCodes: []
            },
            imageUrl: "https://example.com/profile-image.jpg",
            uniqueUsername: "johnny1233",
            username: "johnny1233",
            usernameStatus: "ACTIVE",
            verified: true,
            verifiedInstant: 1748411698619
        }
    },
    statusCode: 200
};
const getProfileData = async ()=>{
    return profiledata.response.user;
};
const getRegistrations = async ()=>{
    return profiledata.response.user.registrations;
};
const getUserApplications = async ()=>{
    return profiledata.response.user.registrations.map((registration)=>({
            key: registration.applicationId,
            title: registration.applicationId,
            icon: "AppIcon",
            status: "active"
        }));
};
}}),
"[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"006e96b71b588dad08c236635600d6b92a4764916a":"fetchUser"} */ __turbopack_context__.s({
    "fetchUser": (()=>fetchUser)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$lib$2f$dal$2f$profile$2d$dal$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/profile-dashboard/lib/dal/profile-dal.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ fetchUser() {
    // Fetch user profile data from the database
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$lib$2f$dal$2f$profile$2d$dal$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProfileData"])();
    return user;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    fetchUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchUser, "006e96b71b588dad08c236635600d6b92a4764916a", null);
}}),
"[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"4031eea0ad745968e875509d0c15d17ddb2ce5982a":"updateProfile"} */ __turbopack_context__.s({
    "updateProfile": (()=>updateProfile)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateProfile(formData) {
    try {
        // Get all form data and convert FormDataEntryValue to string
        const getValue = (key)=>{
            const value = formData.get(key);
            return value ? String(value) : undefined;
        };
        // Construct user data with proper types
        const data = {
            firstName: getValue("firstName") || "",
            lastName: getValue("lastName") || "",
            username: getValue("username"),
            email: getValue("email"),
            birthDate: getValue("birthDate"),
            mobilePhone: getValue("mobilePhone"),
            imageUrl: getValue("imageUrl"),
            data: {
                profession: {
                    title: getValue("title") || ""
                },
                bio: getValue("bio") || "",
                location: {
                    town: getValue("location") || ""
                },
                website: getValue("website"),
                LinkedIn: getValue("linkedin"),
                twitter: getValue("twitter"),
                github: getValue("github")
            }
        };
        console.log(' user data to update: ', data);
        // Here you would typically:
        // 1. Validate the data
        // 2. Make an API call to your backend
        // 3. Update the database
        // const response = await fetch('your-api-endpoint', {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });
        // const result = await response.json();
        // Mock the response by combining existing user data with updates
        const updatedUser = {
            // Add required User fields that shouldn't be updated
            id: "1",
            active: true,
            connectorId: "default",
            insertInstant: new Date().toISOString(),
            lastLoginInstant: new Date().toISOString(),
            lastUpdateInstant: new Date().toISOString(),
            passwordLastUpdateInstant: new Date().toISOString(),
            tenantId: "default",
            twoFactorEnabled: false,
            usernameStatus: "ACTIVE",
            verified: true,
            ...data
        };
        return {
            data: updatedUser
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to update profile"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateProfile
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateProfile, "4031eea0ad745968e875509d0c15d17ddb2ce5982a", null);
}}),
"[project]/apps/profile-dashboard/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
;
}}),
"[project]/apps/profile-dashboard/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$fetchuser$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$updateProfile$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$fetchuser$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$updateProfile$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/profile-dashboard/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/apps/profile-dashboard/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "006e96b71b588dad08c236635600d6b92a4764916a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$fetchuser$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchUser"]),
    "4031eea0ad745968e875509d0c15d17ddb2ce5982a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$updateProfile$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateProfile"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$fetchuser$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$updateProfile$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$fetchuser$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$updateProfile$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/profile-dashboard/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/apps/profile-dashboard/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "006e96b71b588dad08c236635600d6b92a4764916a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$fetchuser$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$updateProfile$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["006e96b71b588dad08c236635600d6b92a4764916a"]),
    "4031eea0ad745968e875509d0c15d17ddb2ce5982a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$fetchuser$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$updateProfile$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4031eea0ad745968e875509d0c15d17ddb2ce5982a"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$fetchuser$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$updateProfile$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/apps/profile-dashboard/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$fetchuser$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$actions$2f$profile$2f$updateProfile$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/apps/profile-dashboard/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/profile-dashboard/app/actions/profile/fetchuser.tsx [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/apps/profile-dashboard/app/actions/profile/updateProfile.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/apps/profile-dashboard/app/favicon.ico.mjs { IMAGE => \"[project]/apps/profile-dashboard/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/profile-dashboard/app/favicon.ico.mjs { IMAGE => \"[project]/apps/profile-dashboard/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/apps/profile-dashboard/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/profile-dashboard/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/apps/profile-dashboard/app/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/profile-dashboard/app/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/profile-dashboard/app/page.tsx <module evaluation>", "default");
}}),
"[project]/apps/profile-dashboard/app/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/apps/profile-dashboard/app/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/profile-dashboard/app/page.tsx", "default");
}}),
"[project]/apps/profile-dashboard/app/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/profile-dashboard/app/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/apps/profile-dashboard/app/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$profile$2d$dashboard$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/apps/profile-dashboard/app/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/apps/profile-dashboard/app/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=apps_profile-dashboard_24aa9e9e._.js.map