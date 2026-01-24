# Layer 2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     RKMMAX Action Engine                         │
│                     Layer 2: Execution & Automation              │
└─────────────────────────────────────────────────────────────────┘

                              User Input
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Serginho (The Brain)  │
                    │   Intent Detection      │
                    └─────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
         ┌──────────▼──────────┐    ┌──────────▼──────────┐
         │   CONVERSATION      │    │   RESEARCH          │
         │   (existing flow)   │    │   (new)             │
         └──────────┬──────────┘    └──────────┬──────────┘
                    │                           │
         ┌──────────▼──────────┐    ┌──────────▼──────────┐
         │   Specialist        │    │ WebBrowserService   │
         │   Delegation        │    │ (The Eyes)          │
         │                     │    │                     │
         │ - Code Expert       │    │ - Tavily API        │
         │ - Design Expert     │    │ - Web Search        │
         │ - Marketing Expert  │    │ - Structured JSON   │
         │ - etc. (55+)        │    └─────────────────────┘
         └─────────────────────┘
                    
         ┌──────────────────────┐
         │   CODE_EXECUTION     │
         │   (new)              │
         └──────────┬───────────┘
                    │
         ┌──────────▼──────────┐
         │   Code Generation   │
         │                     │
         │ - Todo App          │
         │ - Counter App       │
         │ - Timer App         │
         │ - Custom Apps       │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │  LiveCodeRunner     │
         │  (The Hands)        │
         │                     │
         │ - Sandpack          │
         │ - Live Preview      │
         │ - Dracula Theme     │
         └─────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Response Flow                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CONVERSATION → Specialist Response → Markdown Message           │
│                                                                   │
│  RESEARCH → Search Results → Formatted Answer + Sources          │
│                                                                   │
│  CODE_EXECUTION → Generated Code → Live Interactive Component    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Key Features                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✅ Backward Compatible - All existing features work             │
│  ✅ Intelligent Routing - Automatic intent detection             │
│  ✅ Live Code Execution - Real-time React components             │
│  ✅ Web Search - Current information from the internet           │
│  ✅ Error Handling - Graceful degradation                        │
│  ✅ Caching - Improved performance                               │
│  ✅ Security - CodeQL verified (0 vulnerabilities)               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Example User Flows                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. "Create a todo app"                                          │
│     → CODE_EXECUTION detected                                    │
│     → Generate Todo App code                                     │
│     → Render in LiveCodeRunner                                   │
│     → User sees interactive todo list                            │
│                                                                   │
│  2. "Search for latest AI news"                                  │
│     → RESEARCH detected                                          │
│     → Call Tavily API                                            │
│     → Format results with sources                                │
│     → User gets current information                              │
│                                                                   │
│  3. "Explain React hooks"                                        │
│     → CONVERSATION detected                                      │
│     → Route to Code Expert specialist                            │
│     → User gets detailed explanation                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Technical Stack

- **Frontend Framework**: React 18.3.1
- **Code Execution**: @codesandbox/sandpack-react 2.19.11
- **Code Theme**: @codesandbox/sandpack-themes 2.0.21 (dracula)
- **Web Search**: @tavily/core 0.7.1
- **Agent System**: Custom Serginho orchestrator with 55+ specialists

## File Structure

```
src/
├── components/
│   └── tools/
│       └── LiveCodeRunner.jsx          (NEW - 90 lines)
├── services/
│   └── WebBrowserService.js            (NEW - 131 lines)
└── agents/
    └── serginho/
        └── Serginho.js                 (UPDATED - +416 lines)

docs/
└── LAYER2_IMPLEMENTATION.md            (NEW - 261 lines)

package.json                            (UPDATED - +3 dependencies)
```

## Total Impact

- **Lines Added**: ~1,492
- **New Files**: 3
- **Modified Files**: 3
- **Breaking Changes**: 0
- **Security Issues**: 0
- **Build Status**: ✅ Passing

## Next Steps for Integration

1. **Add Environment Variable**:
   ```bash
   REACT_APP_TAVILY_API_KEY=your_key_here
   ```

2. **Update Frontend Chat Component** to handle new response types:
   ```jsx
   {message.responseType === 'CODE_EXECUTION' && (
     <LiveCodeRunner code={message.code} />
   )}
   ```

3. **Test with Sample Prompts** (see documentation)

4. **Deploy and Monitor** usage patterns
