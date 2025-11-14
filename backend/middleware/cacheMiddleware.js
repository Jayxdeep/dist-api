import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 10 }); // cache valid for 10s
export const cacheMiddleware = (req, res, next) => {
  if (req.method !== "GET") return next();
  const key = req.originalUrl; // unique per route 
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log("Cache HIT:", key);
    return res.status(200).json(cachedData);
  }
  console.log("Cache MISS:", key);
  const originalJson=res.json.bind(res);
  const originalSend=res.send.bind(res);
  res.json = (data) => {
    cache.set(key, data);
    originalJson(data);
  };
  res.send=(data)=>{
    try{
        const parsed=typeof data=="string"? JSON.parse(data):data;
        cache.set(key,parsed);
    }catch(err){
    }
    originalSend(data);
  }
  next();
};
