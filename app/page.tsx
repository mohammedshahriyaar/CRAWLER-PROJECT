"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface VideoData {
  title: string;
  views: number;
  thumbnail: string;
}

interface GraphData {
  name: string;
  views: number;
}

export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [videoData, setVideoData] = useState<VideoData[]>([]);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/scrape-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch playlist data");
      }

      const data = await response.json();
      setVideoData(data.videoList);
      setGraphData(data.graphData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    } else {
      return views.toString();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>YouTube Playlist Analyzer</CardTitle>
          <CardDescription>
            Enter a YouTube playlist URL to analyze its videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="Enter YouTube playlist URL"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze Playlist"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {videoData.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Video List</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {videoData.map((video, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <span className="font-bold text-lg min-w-[24px]">
                      {index + 1}.
                    </span>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-auto"
                    />
                    <div>
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-600">
                        {formatViews(video.views)} views
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Count Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


// the code below is for instagram
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// interface ReelData {
//   title: string;
//   views: number;
//   likes: number;
//   comments: number;
//   thumbnail: string;
// }

// interface GraphData {
//   name: string;
//   views: number;
//   likes: number;
//   comments: number;
// }

// export default function Home() {
//   const [profileUrl, setProfileUrl] = useState("");
//   const [reelData, setReelData] = useState<ReelData[]>([]);
//   const [graphData, setGraphData] = useState<GraphData[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/scrape-instagram", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ profileUrl }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch Instagram data");
//       }

//       const data = await response.json();
//       setReelData(data.reelsList);
//       setGraphData(data.graphData);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatViews = (views: number | null | undefined) => {
//     if (views === null || views === undefined) {
//       return "0"; // Return a default value like "0" if views is null or undefined
//     }
  
//     if (views >= 1000000) {
//       return `${(views / 1000000).toFixed(1)}M`;
//     } else if (views >= 1000) {
//       return `${(views / 1000).toFixed(1)}K`;
//     } else {
//       return views.toString();
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Instagram Reels Engagement Analyzer</CardTitle>
//           <CardDescription>
//             Enter an Instagram profile URL to analyze the reels engagement
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               type="url"
//               placeholder="Enter Instagram profile URL"
//               value={profileUrl}
//               onChange={(e) => setProfileUrl(e.target.value)}
//               required
//             />
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? "Analyzing..." : "Analyze Reels"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {reelData.length > 0 && (
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
//           <Card>
//             <CardHeader>
//               <CardTitle>Reels List</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-4">
//                 {reelData.map((reel, index) => (
//                   <li key={index} className="flex items-start space-x-4">
//                     <span className="font-bold text-lg min-w-[24px]">
//                       {index + 1}.
//                     </span>
//                     <img
//                       src={reel.thumbnail}
//                       alt={`Reel ${index + 1}`}
//                       className="w-24 h-auto"
//                     />
//                     <div>
//                       <h3 className="font-semibold">{reel.title || `Reel ${index + 1}`}</h3>
//                       <p className="text-sm text-gray-600">
//                         {formatViews(reel.views)} views, {reel.likes} likes, {reel.comments} comments
//                       </p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Reels Engagement Graph</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={400}>
//                 <LineChart data={graphData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="views"
//                     stroke="#8884d8"
//                     activeDot={{ r: 8 }}
//                     name="Views"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="likes"
//                     stroke="#82ca9d"
//                     activeDot={{ r: 8 }}
//                     name="Likes"
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="comments"
//                     stroke="#ffc658"
//                     activeDot={{ r: 8 }}
//                     name="Comments"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }

