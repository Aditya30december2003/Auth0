This project is built using Next.js, Auth0, Tailwind CSS, Axios, React Hot Toast, React Icons, and the package country-list-with-dial-code-and-flag for phone number inputs.

The application implements:

User authentication using Auth0

N-device login limitation (here N = 3)

User metadata storage for device tracking and phone numbers

Protected and public routes using Auth0 middleware

Additional pages such as a Phone Number Setup page and a Forced Logout page

I used Auth0 User Metadata to store both the user's phone number and the list of devices logged in with the same account.

Example metadata structure:

{
  "phoneNumber": "+19414848662",
  "devices": [
    {
      "deviceId": "a5e95256-8e89-47e6-b3cf-c839710b5835",
      "browserName": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
      "createdAt": 1764956271431,
      "lastSeen": 1764957066825,
      "killed": false
    }
  ]
}
Each device entry stores:

deviceId → unique identifier generated on login

browserName → extracted from user agent(which contain some error)

createdAt → first login timestamp

lastSeen → updated on every page load

killed → marks whether a device was force-logged-out



When a user logs in, their device is registered in metadata.

If the number of active devices exceeds N (3 devices):

The user is asked whether they want to log out an existing device.

If they choose to force logout one, that device’s killed property becomes true.

When a “killed” device visits the site again, it is automatically redirected to the Forced Logout page.

This design allows the frontend to enforce device limits without external storage.

Limitations (Important)

Storing device information inside Auth0 User Metadata works for this project, but it has a few limitations:

Metadata updates are subject to rate limits.

If multiple logins happen quickly, metadata writes may conflict.

Device tracking logic runs client-side, meaning devices could theoretically bypass metadata updates in certain edge cases.

User metadata is not ideal for high-frequency state changes like device heartbeats.

Best Solution for Future Improvements

During research, I found that using Redis is the recommended method to properly implement multi-device limits because: Many big tech companies use this Method
I plan to revisit the project in the future and move the device-tracking system from metadata to Redis, which will provide a more secure and scalable solution.
