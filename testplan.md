# Test Plan

This is the test plan for the sfc map tool. 

## Current Issues
- Layer click, first on is ignored
- Layer click, too many events


DB Structure

Layers
+-- UID
    +-- Map ID
        +-- Layer Id (true /false)


Order of Operations

- Map Load
- Make Groups and Markers
- Get Initial List of Layer Selections
- create groups and annotations
- Subscribe to the changes and modify