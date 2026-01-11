import axios from 'axios';

async function testEndpoint() {
    try {
        console.log('Testing endpoint: http://localhost:3000/api/ai/generate-article');

        const response = await axios.post(
            'http://localhost:3000/api/ai/generate-article',
            {
                prompt: 'impact of ai in jobs',
                length: 8000
            },
            {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zNGdudEdzVFhBa2xreUNOaTNieTFjc2ZFNkIiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3Njc0MTQ1ODUsImZlYSI6InU6YXJ0aWNsZV9nZW5lcmF0aW9uLHU6Z2VuZXJhdGVfaW1hZ2VzLHU6cmVtb3ZlX2JhY2tncm91bmQsdTpyZW1vdmVfb2JqZWN0cyx1OnJlc3VtZV9yZXZpZXcsdTp0aXRsZV9nZW5lcmF0aW9uIiwiZnZhIjpbNTcsLTFdLCJpYXQiOjE3Njc0MTQ1MjUsImlzcyI6Imh0dHBzOi8vYnJhdmUtYmlzb24tNzAuY2xlcmsuYWNjb3VudHMuZGV2IiwibmJmIjoxNzY3NDE0NTE1LCJwbGEiOiJ1OnByZW1pdW0iLCJzaWQiOiJzZXNzXzM3aktaRmkwMnEybWhsd05iSW5sUXFtMXprUCIsInN0cyI6ImFjdGl2ZSIsInN1YiI6InVzZXJfMzRoMGhiUW5Mbkg4MmhZcjFpVjlVRGtmSTdOIiwidiI6Mn0.oglhAFX0_WBmxsOrEzMoJf8YzV9Ze4MBHrjHLndZ_utuUf15QN1zw7C2AxQUwyzYlINM6G426UImOwgRJarSx8tLSXDNcrH4oWeWl1l-fea9XlpcIk5kwWDYnFMXfiXlPYIcgvNjs9rx0jse6DyM226IXfBQW28SOmu4pMfP2SZo7oz0CxR-kknLJd-WjCsUIUf3IB0_uxsWPI-OisnugazYXnF5eVLmRz7CmTfdsfZFlMb0OeyY_w_dnul18QJGVHr8WT4TdrVqhqE95mxFB6PWiAg_xTvX45CWLDYjhosd4P5Ofv6T2E38pCNw6lbugtOJYGGckhuz0NZgO7hdJQ',
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✓ Success!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('✗ Error:');
        console.error('Status:', error.response?.status);
        console.error('Response:', error.response?.data);
        console.error('Message:', error.message);
    }
}

testEndpoint();
