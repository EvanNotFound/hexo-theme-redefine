---
title: Mermaid
date: 2022-10-02 19:07:05
tags: "demo"
sticky: 990
---

## Mermaid JS

```markdown
    sequenceDiagram
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
```

```mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
```

```markdown
gantt
dateFormat YYYY-MM-DD
section Section
Completed :done, des1, 2014-01-06,2014-01-08
Active :active, des2, 2014-01-07, 3d
Parallel 1 : des3, after des1, 1d
Parallel 2 : des4, after des1, 1d
Parallel 3 : des5, after des3, 1d
Parallel 4 : des6, after des4, 1d
```

```mermaid
gantt
	dateFormat  YYYY-MM-DD
  section Section
  Completed :done,    des1, 2014-01-06,2014-01-08
  Active        :active,  des2, 2014-01-07, 3d
  Parallel 1   :         des3, after des1, 1d
  Parallel 2   :         des4, after des1, 1d
  Parallel 3   :         des5, after des3, 1d
  Parallel 4   :         des6, after des4, 1d

```

```markdown
stateDiagram
[*] --> Still
Still --> [*]
Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]
```

```mermaid
stateDiagram
	[*] --> Still
  Still --> [*]
  Still --> Moving
  Moving --> Still
  Moving --> Crash
  Crash --> [*]
```

```markdown
pie
"Dogs" : 386
"Cats" : 85
"Rats" : 15
```

```mermaid
pie
	"Dogs" : 386
  "Cats" : 85
  "Rats" : 15
```

```markdown
journey
title My working day
section Go to work
Make tea: 5: Me
Go upstairs: 3: Me
Do work: 1: Me, Cat
section Go home
Go downstairs: 5: Me
Sit down: 3: Me
```

```mermaid
journey
  title My working day
  section Go to work
    Make tea: 5: Me
    Go upstairs: 3: Me
    Do work: 1: Me, Cat
  section Go home
    Go downstairs: 5: Me
    Sit down: 3: Me
```
