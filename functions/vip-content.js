exports.handler = async function(event, context) {
    if (!context.clientContext || !context.clientContext.user) {
      return {
        statusCode: 401,
        body: `<p>You are not signed in.</p>
        <script>document.getElementById('connect').style.display = 'inline';</script>`,
        headers: { 'Content-Type': 'text/html' },
      };
    }
    const { user } = context.clientContext;
    if (user.app_metadata.roles && user.app_metadata.roles.includes('vip')) {
      return {
        statusCode: 200,
        body: `<p>This is private content that only approved connections can see, congratulations and God bless!</p>
        <br/><br/>
        <script>document.getElementById('connect').style.display = 'inline';</script>`,
        headers: { 'Content-Type': 'text/html' },
      };
    } else {
      return {
        statusCode: 403,
        body: `<p>Approved status not detected: You do not have access to private content.
        <br/>
        <em>
        If you've already received your connection approval email and still see this message, you may need to log out and back in, and/or refresh the page (Ctrl+F5), for the updated status to take effect.
        </em>
        </p>
        <script>document.getElementById('connect').style.display = 'inline';</script>`,
        headers: { 'Content-Type': 'text/html' },
      };
    }
  }
