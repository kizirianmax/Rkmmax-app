@@ .. @@
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/agents" element={<Agents />} />
-            <Route path="/agents/:id" element={<AgentDetail />} />
+            <Route path="/agents/:id" element={<AgentDetail />} />
+            <Route path="/agentes" element={<Agents />} />
+            <Route path="/agentes/:id" element={<AgentDetail />} />
             <Route path="/chat" element={<Chat />} />
+            <Route path="/chat/:agentId" element={<Chat />} />
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="*" element={<NotFound />} />