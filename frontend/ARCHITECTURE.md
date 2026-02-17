# Frontend Architecture Diagram

```mermaid
graph TB
    A[Browser] --> B[Next.js 15 App]
    B --> C[App Router]
    C --> D[Pages]
    C --> E[API Routes]
    C --> F[Middleware]
    
    D --> G[Dashboard Page]
    D --> H[Login Page]
    D --> I[Analysis Page]
    
    G --> J[MoodTrendChart]
    G --> K[ProgressRing]
    G --> L[EmotionWordCloud]
    
    I --> M[SentimentAnalyzer Worker]
    
    B --> N[Zustand Store]
    N --> O[User State]
    N --> P[Mood History]
    
    B --> Q[API Client]
    Q --> R[Backend Services]
    
    S[Tailwind CSS] --> B
    T[Recharts] --> J
    T --> K
    T --> L
    
    U[Web Workers] --> M
    
    style B fill:#3b82f6,stroke:#333,color:white
    style N fill:#10b981,stroke:#333,color:white
    style Q fill:#8b5cf6,stroke:#333,color:white
    style M fill:#f59e0b,stroke:#333,color:white
```

## Component Relationships

### Page Components
- **Dashboard Page**: Main application view with mood tracking visualizations
- **Login Page**: Authentication interface
- **Analysis Page**: Text sentiment analysis interface

### Visualization Components
- **MoodTrendChart**: Recharts-based line chart for mood progression
- **ProgressRing**: SVG-based circular progress indicators
- **EmotionWordCloud**: Dynamic text visualization of emotions

### State Management
- **Zustand Store**: Centralized state management
  - User authentication state
  - Mood history data
  - UI state (loading, errors)

### Data Layer
- **API Client**: Axios-based HTTP client for backend communication
- **Web Workers**: Background processing for sentiment analysis

### Styling & Utilities
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Declarative charting library
- **Middleware**: Authentication and routing logic

## Data Flow

1. User interacts with UI components
2. Actions update Zustand store
3. Components re-render based on state changes
4. API client fetches data from backend services
5. Web Workers process intensive computations
6. Results are displayed through visualization components

## Performance Considerations

- Server-Side Rendering for initial page load
- Client-side hydration for interactivity
- Web Workers for non-blocking computations
- Code splitting for lazy loading
- Responsive design for all devices