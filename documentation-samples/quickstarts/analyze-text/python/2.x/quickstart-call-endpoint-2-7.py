########### Python 2.7 #############
import httplib, urllib, base64

headers = {
    # Request headers includes endpoint key
    # You can use the authoring key instead of the endpoint key.
    # The authoring key allows 1000 endpoint queries a month.
    'Ocp-Apim-Subscription-Key': 'YOUR-KEY',
}

params = urllib.urlencode({
    # Text to analyze
    'q': 'turn on the left light',
    # Optional request parameters, set to default values
    'verbose': 'false',
})

# HTTP Request
try:
    # LUIS endpoint HOST for westus region
    conn = httplib.HTTPSConnection('westus.api.cognitive.microsoft.com')

    # LUIS endpoint path
    # includes public app ID
    conn.request("GET", "/luis/v2.0/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2?%s" % params, "{body}", headers)

    response = conn.getresponse()
    data = response.read()

    # print HTTP response to screen
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################