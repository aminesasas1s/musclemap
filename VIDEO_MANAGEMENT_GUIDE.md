# Video Management System Documentation

## Overview

The exercise video management system allows admins to upload, replace, and delete exercise videos. Regular users can only view videos. The system includes:

- **Admin-only upload/replace/remove controls**
- **File validation** (MP4, WebM, MOV up to 100MB)
- **Upload progress tracking**
- **Persistent video storage**
- **Automatic video updates** when switching exercises

## Features

### For Regular Users
- View exercise videos during workouts
- Watch videos on the Exercise Details page
- See placeholder when no video is available

### For Admins
- Upload new exercise videos
- Replace existing exercise videos
- Remove exercise videos
- See upload progress in real-time
- Get success/error notifications

## File Structure

```
src/
├── components/
│   └── VideoUploadManager.jsx      # Reusable upload component
├── pages/
│   ├── ExerciseDetailsPage.jsx     # Exercise details with video management
│   └── WorkoutPlansPage.jsx        # Workout session with video management
└── data.js                          # User and video utility functions
```

## Configuration

### Environment Variables

Create a `.env` file in the project root (optional, for upload security):

```
VITE_UPLOAD_TOKEN=your_secret_token_here
```

If you set `UPLOAD_TOKEN` on the server (environment variable), all uploads must include that token in the header.

### Backend

The server (server.js) handles:
- File upload with multer
- File type validation (video/*, image/gif)
- File size limits (default 200MB)
- Metadata persistence (uploads.json)
- Automatic old file cleanup on replace

Endpoints:
- `POST /api/upload` - Upload a video
- `GET /api/uploads` - List all uploads
- `DELETE /api/upload` - Delete a video
- `POST /api/add-url` - Add external video URL

## Usage

### In ExerciseDetailsPage

```jsx
import VideoUploadManager from '../components/VideoUploadManager'

// Inside component
const [videoUrl, setVideoUrl] = useState(exercise.videoUrl)
const isAdmin = isUserAdmin(currentUser)

const handleVideoUpload = (newVideoUrl) => {
  setVideoUrl(newVideoUrl)
  updateExerciseVideo(exercise.id, newVideoUrl)
}

// In JSX
{isAdmin && (
  <VideoUploadManager
    exerciseId={exercise.id}
    currentVideoUrl={videoUrl}
    onVideoUpload={handleVideoUpload}
    isAdmin={true}
  />
)}
```

### In WorkoutPlansPage

Same pattern - import the component, check `isAdmin`, render the manager only for admins.

## API Response Format

When uploading a video, the server responds with:

```json
{
  "success": true,
  "upload": {
    "muscle": "exercise",
    "slot": 1,
    "path": "/uploads/exercise-1234567-abcdef.mp4",
    "videoUrl": "/uploads/exercise-1234567-abcdef.mp4"
  },
  "videoUrl": "/uploads/exercise-1234567-abcdef.mp4"
}
```

## Video Storage

Videos are stored in the `uploads/` directory:
- **Directory**: `./uploads/`
- **Metadata**: `./uploads/uploads.json`
- **Served via**: `http://localhost:5175/uploads/`

Filenames are auto-generated with format:
```
[muscle]-[timestamp]-[random].mp4
```

Example: `exercise-1691234567-abc123.mp4`

## User Roles

The system uses a role-based permission model:

```javascript
// Admin - Full access
{
  email: 'admin@musclemap.fit',
  password: 'admin123',
  role: 'admin'
}

// Regular User - View only
{
  email: 'user@example.com',
  password: 'password123',
  role: 'user'
}
```

Admin check:
```javascript
import { isUserAdmin, getCurrentUser } from '../data'

const currentUser = getCurrentUser()
const isAdmin = isUserAdmin(currentUser)
```

## Upload Validation

### File Type
- Accepted: MP4, WebM, MOV
- Rejected: Any other format

### File Size
- Maximum: 100MB
- Error message shown if exceeded

### Error Handling
- Network errors
- File validation failures
- Server errors (500, etc.)
- Upload cancellation

## Video Persistence

Videos persist across:
- Page refreshes
- Navigation between exercises
- App restarts

Each exercise stores its videoUrl in the exerciseCatalog, which is updated when:
1. Admin uploads a new video
2. Admin replaces an existing video
3. Admin removes a video

## UI Components

### VideoUploadManager
Props:
- `exerciseId` (number) - ID of the exercise
- `currentVideoUrl` (string|null) - Current video URL
- `onVideoUpload` (function) - Callback when upload completes
- `isAdmin` (boolean) - Show/hide admin controls

Displays:
- Upload/Replace button for admins
- Remove button (if video exists)
- Upload progress bar
- Success/error messages
- File input (hidden)

### Video Player

In ExerciseDetailsPage and WorkoutPlansPage:
- Shows video if `exercise.videoUrl` exists
- Shows placeholder if no video
- HTML5 player with native controls
- Responsive sizing (h-80 on details, h-72 on workout)

## Security Considerations

1. **Token-based Upload**: Optional UPLOAD_TOKEN prevents unauthorized uploads
2. **File Type Validation**: Only video files and GIFs accepted
3. **File Size Limits**: Prevents abuse with large files
4. **Admin-only UI**: Management controls only visible to admins
5. **Role Checking**: Backend can verify user role before allowing uploads

## Troubleshooting

### Video not uploading
- Check file size (max 100MB)
- Verify file type (MP4, WebM, MOV)
- Check network connection
- Verify UPLOAD_TOKEN if configured

### Video not appearing after upload
- Refresh the page
- Check browser console for errors
- Verify server is running on port 5175
- Check uploads.json metadata file

### CORS errors
- Ensure server has CORS middleware enabled
- Verify client and server URLs match

### Upload token issues
- Make sure VITE_UPLOAD_TOKEN matches server UPLOAD_TOKEN
- If using token, pass it in x-upload-token header

## Future Enhancements

Potential improvements:
- Video compression on upload
- Thumbnail extraction
- Multiple quality levels
- Video trimming/editing
- Bulk upload
- Video analytics/view counts
- Streaming optimization
- Video caching strategy
