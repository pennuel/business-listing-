const profiledata = {
  response: {
    refreshToken: "5RGf9LvhX8nq33Eb-DnWAlmQd5buFFUR-TLR1sicX0YeOBvsCXXhhQ",
    refreshTokenId: "e3c9de16-dce9-49c7-9572-7305ee48e69e",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijk4NjgzZGY5MiJ9.eyJhdWQiOiI3NzZhY2Q3NC0xOWQzLTRiZTktOTE4MC1iMGM3OThmNWM3YzQiLCJleHAiOjE3NTA2ODc3NDksImlhdCI6MTc1MDY4NDE0OSwiaXNzIjoidGhpbmsubmV0Iiwic3ViIjoiMTY3YTcyYTQtNjIxMi00YWQ0LWJlYjEtNzIyNjVhZjc3OTdlIiwianRpIjoiNDMyNzQ0MDktZjYwMy00NjQ3LTgzMmUtYTQ0YzE0ZTIyOWY4IiwiYXV0aGVudGljYXRpb25UeXBlIjoiUEFTU1dPUkQiLCJhcHBsaWNhdGlvbklkIjoiNzc2YWNkNzQtMTlkMy00YmU5LTkxODAtYjBjNzk4ZjVjN2M0Iiwicm9sZXMiOlsiYWRtaW4iXSwic2lkIjoiZTNjOWRlMTYtZGNlOS00OWM3LTk1NzItNzMwNWVlNDhlNjllIiwiYXV0aF90aW1lIjoxNzUwNjg0MTQ5LCJ0aWQiOiIwZjE5Mzg5Zi1kYmQxLTQ4NTMtYWIwZi0zM2ZjZDJhYzFlZDAifQ.QIfmeARsW-FwXGzuOLPokJHxsHgBr4dzWuqYTNKn-g8",
    tokenExpirationInstant: 1750687749873,
    user: {
      active: true,
      birthDate: "1976-05-30",
      connectorId: "e3306678-a53a-4964-9040-1c96f36dda72",
      data: {
        'profession': {
          'title': ["software engineer"],
          "skill" : [],
        },
        'role': ['Member'],
        'bio' : "John Doe is a software engineer with over 10 years of experience in web development. He enjoys coding, hiking, and photography.",
        'location': {
          "town":"Denver, CO"},
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
      preferredLanguages: ['english', 'spanish'],
      registrations: [
        {
          applicationId: "776acd74-19d3-4be9-9180-b0c798f5c7c4",
          data: {},
          id: "4485c89f-1f32-475a-91a0-7a5fc0bc71f5",
          insertInstant: 1748538163689,
          lastLoginInstant: 1750684149854,
          lastUpdateInstant: 1748548862316,
          preferredLanguages: [],
          roles: ["admin"],
          tokens: {},
          usernameStatus: "ACTIVE",
          verified: true,
          verifiedInstant: 1748538163689,
        },
        {
          applicationId: "132d4c65-8205-40a3-bd4c-a81015f236af",
          data: {
            "5b923330-ad30-4988-9c00-fe8737791949": {
              data: {},
              group_id: "5b923330-ad30-4988-9c00-fe8737791949",
              role: ["member"],
            },
          },
          id: "dec0db89-4150-484e-a670-44d3a550c063",
          insertInstant: 1748411698693,
          lastLoginInstant: 1749630400816,
          lastUpdateInstant: 1749630412727,
          preferredLanguages: [],
          roles: ["practitioner", "user"],
          tokens: {},
          usernameStatus: "ACTIVE",
          verified: true,
          verifiedInstant: 1748411698693,
        },
      ],
      tenantId: "0f19389f-dbd1-4853-ab0f-33fcd2ac1ed0",
      twoFactor: {
        methods: [],
        recoveryCodes: [],
      },
      imageUrl: "https://example.com/profile-image.jpg",
      uniqueUsername: "johnny1233",
      username: "johnny1233",
      usernameStatus: "ACTIVE",
      verified: true,
      verifiedInstant: 1748411698619,
    },
  },
  statusCode: 200,
};


export  const getProfileData = async () => {
    return profiledata.response.user;
}
export const getRegistrations = async () => {
    return profiledata.response.user.registrations;
}

export const getUserApplications = async () => {
    return profiledata.response.user.registrations.map((registration) => ({
        key: registration.applicationId,
        title: registration.applicationId, // Assuming applicationId is the title
        icon: "AppIcon", // Replace with actual icon component or path
        status: "active", // Replace with actual status logic
    }));
}