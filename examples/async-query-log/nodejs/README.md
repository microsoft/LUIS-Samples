# Get query log asynchronously

## Full cycle of request download, wait for download, save file to disk

```
node getQueryLog.js --appid 123 --authkey 123 
```

## Full cycle with named file and region

```
node getQueryLog.js --file 123.csv --appid 123 --authkey 456 --region westus
```

## Begin download process on server with region

```
node getQueryLog.js --appid 123 --authkey 456 --region westus --step begin
```

## Request status with region

```
node getQueryLog.js --appid 123 --authkey 456 --region westus --step status
```

## Request download file with region

```
node getQueryLog.js --appid 123 --authkey 456 --region westus --step final
```