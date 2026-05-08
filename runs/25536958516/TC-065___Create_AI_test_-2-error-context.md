# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-065 — Create AI test case with name and description
- Location: tests/test-cases.spec.ts:194:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('div[role="dialog"][data-tour="create-tc-modal"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - img "Xitester" [ref=e7]
        - generic [ref=e8]:
          - generic [ref=e9]: /
          - generic [ref=e10]:
            - button "XiTester Enterprise" [ref=e11] [cursor=pointer]:
              - img [ref=e12]
              - generic [ref=e16]: XiTester
              - generic [ref=e17]: Enterprise
            - button [ref=e18] [cursor=pointer]:
              - img [ref=e19]
          - generic [ref=e22]: /
          - generic [ref=e23]:
            - button "Default Project" [ref=e24] [cursor=pointer]:
              - img [ref=e25]
              - generic [ref=e27]: Default Project
            - button [ref=e28] [cursor=pointer]:
              - img [ref=e29]
      - generic [ref=e32]:
        - button "Search... ⌘K" [ref=e33] [cursor=pointer]:
          - img [ref=e34]
          - generic [ref=e37]: Search...
          - generic [ref=e38]: ⌘K
        - generic [ref=e39]:
          - button "Help" [ref=e40] [cursor=pointer]:
            - img [ref=e41]
          - button "Notifications" [ref=e44] [cursor=pointer]:
            - img [ref=e45]
            - generic [ref=e48]: 99+
        - generic [ref=e50]:
          - generic [ref=e51]: DEV
          - generic [ref=e52]: v1.1.0
          - button "A" [ref=e53] [cursor=pointer]
    - generic [ref=e54]:
      - complementary:
        - navigation [ref=e55]:
          - button "Dashboard" [ref=e56] [cursor=pointer]:
            - img [ref=e58]
            - generic: Dashboard
          - button "Test Cases" [ref=e63] [cursor=pointer]:
            - img [ref=e65]
            - generic: Test Cases
          - button "Test Plans" [ref=e68] [cursor=pointer]:
            - img [ref=e70]
            - generic: Test Plans
          - button "Discovery" [ref=e74] [cursor=pointer]:
            - img [ref=e76]
            - generic: Discovery
          - button "Test Plan AI" [ref=e83] [cursor=pointer]:
            - img [ref=e85]
            - generic: Test Plan AI
          - button "Test Data" [ref=e97] [cursor=pointer]:
            - img [ref=e99]
            - generic: Test Data
          - button "Api Tester" [ref=e103] [cursor=pointer]:
            - img [ref=e105]
            - generic: Api Tester
          - button "Settings" [ref=e110] [cursor=pointer]:
            - img [ref=e112]
            - generic: Settings
        - button "Logout" [ref=e117] [cursor=pointer]:
          - img [ref=e119]
          - generic: Logout
      - main [ref=e123]:
        - generic [ref=e124]:
          - generic [ref=e125]:
            - generic [ref=e126]:
              - heading "Test Cases" [level=1] [ref=e127]
              - paragraph [ref=e128]: View and manage your test case analysis sessions
            - generic [ref=e129]:
              - button "Refresh" [ref=e130] [cursor=pointer]:
                - img [ref=e131]
                - text: Refresh
              - button "New Test Case" [ref=e137] [cursor=pointer]:
                - img [ref=e138]
                - text: New Test Case
                - img [ref=e139]
          - generic [ref=e142]:
            - generic [ref=e143]:
              - img [ref=e144]
              - textbox "Search test cases…" [ref=e147]
            - button "Status" [ref=e148] [cursor=pointer]:
              - img [ref=e149]
              - text: Status
            - button "Last Run" [ref=e151] [cursor=pointer]:
              - img [ref=e152]
              - text: Last Run
            - button "Created By" [ref=e154] [cursor=pointer]:
              - img [ref=e155]
              - text: Created By
            - button "Tags" [ref=e157] [cursor=pointer]:
              - img [ref=e158]
              - text: Tags
            - button "Test Plan" [ref=e160] [cursor=pointer]:
              - img [ref=e161]
              - text: Test Plan
            - button "Source" [ref=e163] [cursor=pointer]:
              - img [ref=e164]
              - text: Source
          - table [ref=e168]:
            - rowgroup [ref=e169]:
              - row "# Title / Prompt Tags Analysis Status Last Run Steps Created Actions" [ref=e170]:
                - columnheader [ref=e171]:
                  - checkbox [ref=e172] [cursor=pointer]
                - columnheader "#" [ref=e173]
                - columnheader "Title / Prompt" [ref=e174]
                - columnheader "Tags" [ref=e175]
                - columnheader "Analysis Status" [ref=e176]
                - columnheader "Last Run" [ref=e177]
                - columnheader "Steps" [ref=e178]
                - columnheader "Created" [ref=e179]
                - columnheader "Actions" [ref=e180]
            - rowgroup [ref=e181]:
              - link "1 record test2_2 Recorded Add tags Ready to Record No Runs 1 May 7, 2026, 07:38 AM by Midhilaj Clone test case Edit test case Delete test case" [ref=e182] [cursor=pointer]:
                - cell [ref=e183]:
                  - checkbox [ref=e184]
                - cell "1" [ref=e185]
                - cell "record test2_2 Recorded" [ref=e186]:
                  - generic [ref=e188]:
                    - generic [ref=e189]: record test2_2
                    - generic [ref=e190]:
                      - img [ref=e191]
                      - text: Recorded
                - cell "Add tags" [ref=e194]:
                  - button "Add tags" [ref=e195]:
                    - generic [ref=e196]:
                      - img [ref=e197]
                      - text: Add tags
                - cell "Ready to Record" [ref=e200]:
                  - generic [ref=e201]: Ready to Record
                - cell "No Runs" [ref=e203]:
                  - generic [ref=e206]: No Runs
                - cell "1" [ref=e207]
                - cell "May 7, 2026, 07:38 AM by Midhilaj" [ref=e208]:
                  - generic [ref=e209]:
                    - generic [ref=e210]: May 7, 2026, 07:38 AM
                    - generic [ref=e211]: by Midhilaj
                - cell "Clone test case Edit test case Delete test case" [ref=e212]:
                  - generic [ref=e213]:
                    - button "Clone test case" [ref=e214]:
                      - img [ref=e215]
                    - button "Edit test case" [ref=e218]:
                      - img [ref=e219]
                    - button "Delete test case" [ref=e222]:
                      - img [ref=e223]
              - link "2 record test2 Manual Add tags Idle No Runs 0 May 7, 2026, 07:38 AM by Midhilaj Clone test case Edit test case Delete test case" [ref=e226] [cursor=pointer]:
                - cell [ref=e227]:
                  - checkbox [ref=e228]
                - cell "2" [ref=e229]
                - cell "record test2 Manual" [ref=e230]:
                  - generic [ref=e232]:
                    - generic [ref=e233]: record test2
                    - generic [ref=e234]:
                      - img [ref=e235]
                      - text: Manual
                - cell "Add tags" [ref=e238]:
                  - button "Add tags" [ref=e239]:
                    - generic [ref=e240]:
                      - img [ref=e241]
                      - text: Add tags
                - cell "Idle" [ref=e244]:
                  - generic [ref=e245]: Idle
                - cell "No Runs" [ref=e247]:
                  - generic [ref=e250]: No Runs
                - cell "0" [ref=e251]
                - cell "May 7, 2026, 07:38 AM by Midhilaj" [ref=e252]:
                  - generic [ref=e253]:
                    - generic [ref=e254]: May 7, 2026, 07:38 AM
                    - generic [ref=e255]: by Midhilaj
                - cell "Clone test case Edit test case Delete test case" [ref=e256]:
                  - generic [ref=e257]:
                    - button "Clone test case" [ref=e258]:
                      - img [ref=e259]
                    - button "Edit test case" [ref=e262]:
                      - img [ref=e263]
                    - button "Delete test case" [ref=e266]:
                      - img [ref=e267]
              - link "3 record assert Recorded Add tags Completed No Runs 28 May 6, 2026, 01:01 PM by Arshad Sanin Clone test case Edit test case Delete test case" [ref=e270] [cursor=pointer]:
                - cell [ref=e271]:
                  - checkbox [ref=e272]
                - cell "3" [ref=e273]
                - cell "record assert Recorded" [ref=e274]:
                  - generic [ref=e276]:
                    - generic [ref=e277]: record assert
                    - generic [ref=e278]:
                      - img [ref=e279]
                      - text: Recorded
                - cell "Add tags" [ref=e282]:
                  - button "Add tags" [ref=e283]:
                    - generic [ref=e284]:
                      - img [ref=e285]
                      - text: Add tags
                - cell "Completed" [ref=e288]:
                  - generic [ref=e289]: Completed
                - cell "No Runs" [ref=e291]:
                  - generic [ref=e294]: No Runs
                - cell "28" [ref=e295]
                - cell "May 6, 2026, 01:01 PM by Arshad Sanin" [ref=e296]:
                  - generic [ref=e297]:
                    - generic [ref=e298]: May 6, 2026, 01:01 PM
                    - generic [ref=e299]: by Arshad Sanin
                - cell "Clone test case Edit test case Delete test case" [ref=e300]:
                  - generic [ref=e301]:
                    - button "Clone test case" [ref=e302]:
                      - img [ref=e303]
                    - button "Edit test case" [ref=e306]:
                      - img [ref=e307]
                    - button "Delete test case" [ref=e310]:
                      - img [ref=e311]
              - link "4 Validate Mandatory Fields in Manual Order Entry AI Referenced Add tags Failed No Runs 3 May 4, 2026, 12:02 PM by Admin User Clone test case Edit test case Delete test case" [ref=e314] [cursor=pointer]:
                - cell [ref=e315]:
                  - checkbox [ref=e316]
                - cell "4" [ref=e317]
                - cell "Validate Mandatory Fields in Manual Order Entry AI Referenced" [ref=e318]:
                  - generic [ref=e320]:
                    - generic [ref=e321]: Validate Mandatory Fields in Manual Order Entry
                    - generic [ref=e322]:
                      - img [ref=e323]
                      - text: AI
                    - generic "Part of a test plan" [ref=e326]:
                      - img [ref=e327]
                      - text: Referenced
                - cell "Add tags" [ref=e331]:
                  - button "Add tags" [ref=e332]:
                    - generic [ref=e333]:
                      - img [ref=e334]
                      - text: Add tags
                - cell "Failed" [ref=e337]:
                  - generic [ref=e338]: Failed
                - cell "No Runs" [ref=e340]:
                  - generic [ref=e343]: No Runs
                - cell "3" [ref=e344]
                - cell "May 4, 2026, 12:02 PM by Admin User" [ref=e345]:
                  - generic [ref=e346]:
                    - generic [ref=e347]: May 4, 2026, 12:02 PM
                    - generic [ref=e348]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e349]:
                  - generic [ref=e350]:
                    - button "Clone test case" [ref=e351]:
                      - img [ref=e352]
                    - button "Edit test case" [ref=e355]:
                      - img [ref=e356]
                    - button "Delete test case" [ref=e359]:
                      - img [ref=e360]
              - link "5 FFS Manual Add tags Completed No Runs 2 Apr 26, 2026, 04:07 PM by Admin User Clone test case Edit test case Delete test case" [ref=e363] [cursor=pointer]:
                - cell [ref=e364]:
                  - checkbox [ref=e365]
                - cell "5" [ref=e366]
                - cell "FFS Manual" [ref=e367]:
                  - generic [ref=e369]:
                    - generic [ref=e370]: FFS
                    - generic [ref=e371]:
                      - img [ref=e372]
                      - text: Manual
                - cell "Add tags" [ref=e375]:
                  - button "Add tags" [ref=e376]:
                    - generic [ref=e377]:
                      - img [ref=e378]
                      - text: Add tags
                - cell "Completed" [ref=e381]:
                  - generic [ref=e382]: Completed
                - cell "No Runs" [ref=e384]:
                  - generic [ref=e387]: No Runs
                - cell "2" [ref=e388]
                - cell "Apr 26, 2026, 04:07 PM by Admin User" [ref=e389]:
                  - generic [ref=e390]:
                    - generic [ref=e391]: Apr 26, 2026, 04:07 PM
                    - generic [ref=e392]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e393]:
                  - generic [ref=e394]:
                    - button "Clone test case" [ref=e395]:
                      - img [ref=e396]
                    - button "Edit test case" [ref=e399]:
                      - img [ref=e400]
                    - button "Delete test case" [ref=e403]:
                      - img [ref=e404]
              - link "6 TT3 Manual Add tags Idle No Runs 0 Apr 26, 2026, 03:51 PM by Admin User Clone test case Edit test case Delete test case" [ref=e407] [cursor=pointer]:
                - cell [ref=e408]:
                  - checkbox [ref=e409]
                - cell "6" [ref=e410]
                - cell "TT3 Manual" [ref=e411]:
                  - generic [ref=e413]:
                    - generic [ref=e414]: TT3
                    - generic [ref=e415]:
                      - img [ref=e416]
                      - text: Manual
                - cell "Add tags" [ref=e419]:
                  - button "Add tags" [ref=e420]:
                    - generic [ref=e421]:
                      - img [ref=e422]
                      - text: Add tags
                - cell "Idle" [ref=e425]:
                  - generic [ref=e426]: Idle
                - cell "No Runs" [ref=e428]:
                  - generic [ref=e431]: No Runs
                - cell "0" [ref=e432]
                - cell "Apr 26, 2026, 03:51 PM by Admin User" [ref=e433]:
                  - generic [ref=e434]:
                    - generic [ref=e435]: Apr 26, 2026, 03:51 PM
                    - generic [ref=e436]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e437]:
                  - generic [ref=e438]:
                    - button "Clone test case" [ref=e439]:
                      - img [ref=e440]
                    - button "Edit test case" [ref=e443]:
                      - img [ref=e444]
                    - button "Delete test case" [ref=e447]:
                      - img [ref=e448]
              - link "7 TT1 Manual Add tags Completed No Runs 7 Apr 26, 2026, 03:22 PM by Admin User Clone test case Edit test case Delete test case" [ref=e451] [cursor=pointer]:
                - cell [ref=e452]:
                  - checkbox [ref=e453]
                - cell "7" [ref=e454]
                - cell "TT1 Manual" [ref=e455]:
                  - generic [ref=e457]:
                    - generic [ref=e458]: TT1
                    - generic [ref=e459]:
                      - img [ref=e460]
                      - text: Manual
                - cell "Add tags" [ref=e463]:
                  - button "Add tags" [ref=e464]:
                    - generic [ref=e465]:
                      - img [ref=e466]
                      - text: Add tags
                - cell "Completed" [ref=e469]:
                  - generic [ref=e470]: Completed
                - cell "No Runs" [ref=e472]:
                  - generic [ref=e475]: No Runs
                - cell "7" [ref=e476]
                - cell "Apr 26, 2026, 03:22 PM by Admin User" [ref=e477]:
                  - generic [ref=e478]:
                    - generic [ref=e479]: Apr 26, 2026, 03:22 PM
                    - generic [ref=e480]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e481]:
                  - generic [ref=e482]:
                    - button "Clone test case" [ref=e483]:
                      - img [ref=e484]
                    - button "Edit test case" [ref=e487]:
                      - img [ref=e488]
                    - button "Delete test case" [ref=e491]:
                      - img [ref=e492]
              - link "8 Test 1 Manual Add tags Completed No Runs 1 Apr 26, 2026, 03:16 PM by Admin User Clone test case Edit test case Delete test case" [ref=e495] [cursor=pointer]:
                - cell [ref=e496]:
                  - checkbox [ref=e497]
                - cell "8" [ref=e498]
                - cell "Test 1 Manual" [ref=e499]:
                  - generic [ref=e501]:
                    - generic [ref=e502]: Test 1
                    - generic [ref=e503]:
                      - img [ref=e504]
                      - text: Manual
                - cell "Add tags" [ref=e507]:
                  - button "Add tags" [ref=e508]:
                    - generic [ref=e509]:
                      - img [ref=e510]
                      - text: Add tags
                - cell "Completed" [ref=e513]:
                  - generic [ref=e514]: Completed
                - cell "No Runs" [ref=e516]:
                  - generic [ref=e519]: No Runs
                - cell "1" [ref=e520]
                - cell "Apr 26, 2026, 03:16 PM by Admin User" [ref=e521]:
                  - generic [ref=e522]:
                    - generic [ref=e523]: Apr 26, 2026, 03:16 PM
                    - generic [ref=e524]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e525]:
                  - generic [ref=e526]:
                    - button "Clone test case" [ref=e527]:
                      - img [ref=e528]
                    - button "Edit test case" [ref=e531]:
                      - img [ref=e532]
                    - button "Delete test case" [ref=e535]:
                      - img [ref=e536]
              - link "9 go to google.com Manual Add tags Completed No Runs 4 Apr 26, 2026, 03:32 AM by Admin User Clone test case Edit test case Delete test case" [ref=e539] [cursor=pointer]:
                - cell [ref=e540]:
                  - checkbox [ref=e541]
                - cell "9" [ref=e542]
                - cell "go to google.com Manual" [ref=e543]:
                  - generic [ref=e545]:
                    - generic [ref=e546]: go to google.com
                    - generic [ref=e547]:
                      - img [ref=e548]
                      - text: Manual
                - cell "Add tags" [ref=e551]:
                  - button "Add tags" [ref=e552]:
                    - generic [ref=e553]:
                      - img [ref=e554]
                      - text: Add tags
                - cell "Completed" [ref=e557]:
                  - generic [ref=e558]: Completed
                - cell "No Runs" [ref=e560]:
                  - generic [ref=e563]: No Runs
                - cell "4" [ref=e564]
                - cell "Apr 26, 2026, 03:32 AM by Admin User" [ref=e565]:
                  - generic [ref=e566]:
                    - generic [ref=e567]: Apr 26, 2026, 03:32 AM
                    - generic [ref=e568]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e569]:
                  - generic [ref=e570]:
                    - button "Clone test case" [ref=e571]:
                      - img [ref=e572]
                    - button "Edit test case" [ref=e575]:
                      - img [ref=e576]
                    - button "Delete test case" [ref=e579]:
                      - img [ref=e580]
              - link "10 go to google.com Manual Add tags Completed No Runs 3 Apr 26, 2026, 03:19 AM by Admin User Clone test case Edit test case Delete test case" [ref=e583] [cursor=pointer]:
                - cell [ref=e584]:
                  - checkbox [ref=e585]
                - cell "10" [ref=e586]
                - cell "go to google.com Manual" [ref=e587]:
                  - generic [ref=e589]:
                    - generic [ref=e590]: go to google.com
                    - generic [ref=e591]:
                      - img [ref=e592]
                      - text: Manual
                - cell "Add tags" [ref=e595]:
                  - button "Add tags" [ref=e596]:
                    - generic [ref=e597]:
                      - img [ref=e598]
                      - text: Add tags
                - cell "Completed" [ref=e601]:
                  - generic [ref=e602]: Completed
                - cell "No Runs" [ref=e604]:
                  - generic [ref=e607]: No Runs
                - cell "3" [ref=e608]
                - cell "Apr 26, 2026, 03:19 AM by Admin User" [ref=e609]:
                  - generic [ref=e610]:
                    - generic [ref=e611]: Apr 26, 2026, 03:19 AM
                    - generic [ref=e612]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e613]:
                  - generic [ref=e614]:
                    - button "Clone test case" [ref=e615]:
                      - img [ref=e616]
                    - button "Edit test case" [ref=e619]:
                      - img [ref=e620]
                    - button "Delete test case" [ref=e623]:
                      - img [ref=e624]
              - link "11 goto google.com Manual Add tags Completed No Runs 10 Apr 26, 2026, 03:09 AM by Admin User Clone test case Edit test case Delete test case" [ref=e627] [cursor=pointer]:
                - cell [ref=e628]:
                  - checkbox [ref=e629]
                - cell "11" [ref=e630]
                - cell "goto google.com Manual" [ref=e631]:
                  - generic [ref=e633]:
                    - generic [ref=e634]: goto google.com
                    - generic [ref=e635]:
                      - img [ref=e636]
                      - text: Manual
                - cell "Add tags" [ref=e639]:
                  - button "Add tags" [ref=e640]:
                    - generic [ref=e641]:
                      - img [ref=e642]
                      - text: Add tags
                - cell "Completed" [ref=e645]:
                  - generic [ref=e646]: Completed
                - cell "No Runs" [ref=e648]:
                  - generic [ref=e651]: No Runs
                - cell "10" [ref=e652]
                - cell "Apr 26, 2026, 03:09 AM by Admin User" [ref=e653]:
                  - generic [ref=e654]:
                    - generic [ref=e655]: Apr 26, 2026, 03:09 AM
                    - generic [ref=e656]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e657]:
                  - generic [ref=e658]:
                    - button "Clone test case" [ref=e659]:
                      - img [ref=e660]
                    - button "Edit test case" [ref=e663]:
                      - img [ref=e664]
                    - button "Delete test case" [ref=e667]:
                      - img [ref=e668]
              - link "12 go to google.com Manual Add tags Completed No Runs 2 Apr 26, 2026, 02:56 AM by Admin User Clone test case Edit test case Delete test case" [ref=e671] [cursor=pointer]:
                - cell [ref=e672]:
                  - checkbox [ref=e673]
                - cell "12" [ref=e674]
                - cell "go to google.com Manual" [ref=e675]:
                  - generic [ref=e677]:
                    - generic [ref=e678]: go to google.com
                    - generic [ref=e679]:
                      - img [ref=e680]
                      - text: Manual
                - cell "Add tags" [ref=e683]:
                  - button "Add tags" [ref=e684]:
                    - generic [ref=e685]:
                      - img [ref=e686]
                      - text: Add tags
                - cell "Completed" [ref=e689]:
                  - generic [ref=e690]: Completed
                - cell "No Runs" [ref=e692]:
                  - generic [ref=e695]: No Runs
                - cell "2" [ref=e696]
                - cell "Apr 26, 2026, 02:56 AM by Admin User" [ref=e697]:
                  - generic [ref=e698]:
                    - generic [ref=e699]: Apr 26, 2026, 02:56 AM
                    - generic [ref=e700]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e701]:
                  - generic [ref=e702]:
                    - button "Clone test case" [ref=e703]:
                      - img [ref=e704]
                    - button "Edit test case" [ref=e707]:
                      - img [ref=e708]
                    - button "Delete test case" [ref=e711]:
                      - img [ref=e712]
              - link "13 go to google.com Manual Add tags Completed No Runs 2 Apr 26, 2026, 02:04 AM by Admin User Clone test case Edit test case Delete test case" [ref=e715] [cursor=pointer]:
                - cell [ref=e716]:
                  - checkbox [ref=e717]
                - cell "13" [ref=e718]
                - cell "go to google.com Manual" [ref=e719]:
                  - generic [ref=e721]:
                    - generic [ref=e722]: go to google.com
                    - generic [ref=e723]:
                      - img [ref=e724]
                      - text: Manual
                - cell "Add tags" [ref=e727]:
                  - button "Add tags" [ref=e728]:
                    - generic [ref=e729]:
                      - img [ref=e730]
                      - text: Add tags
                - cell "Completed" [ref=e733]:
                  - generic [ref=e734]: Completed
                - cell "No Runs" [ref=e736]:
                  - generic [ref=e739]: No Runs
                - cell "2" [ref=e740]
                - cell "Apr 26, 2026, 02:04 AM by Admin User" [ref=e741]:
                  - generic [ref=e742]:
                    - generic [ref=e743]: Apr 26, 2026, 02:04 AM
                    - generic [ref=e744]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e745]:
                  - generic [ref=e746]:
                    - button "Clone test case" [ref=e747]:
                      - img [ref=e748]
                    - button "Edit test case" [ref=e751]:
                      - img [ref=e752]
                    - button "Delete test case" [ref=e755]:
                      - img [ref=e756]
              - link "14 go to google.com Manual Add tags Completed Failed 1 1 41 Apr 26, 2026, 01:43 AM by Admin User Clone test case Edit test case Delete test case" [ref=e759] [cursor=pointer]:
                - cell [ref=e760]:
                  - checkbox [ref=e761]
                - cell "14" [ref=e762]
                - cell "go to google.com Manual" [ref=e763]:
                  - generic [ref=e765]:
                    - generic [ref=e766]: go to google.com
                    - generic [ref=e767]:
                      - img [ref=e768]
                      - text: Manual
                - cell "Add tags" [ref=e771]:
                  - button "Add tags" [ref=e772]:
                    - generic [ref=e773]:
                      - img [ref=e774]
                      - text: Add tags
                - cell "Completed" [ref=e777]:
                  - generic [ref=e778]: Completed
                - cell "Failed 1 1" [ref=e780]:
                  - generic [ref=e781]:
                    - generic [ref=e783]:
                      - img [ref=e784]
                      - text: Failed
                    - generic [ref=e788]:
                      - generic "Passed runs" [ref=e789]: "1"
                      - generic "Failed runs" [ref=e791]: "1"
                - cell "41" [ref=e793]
                - cell "Apr 26, 2026, 01:43 AM by Admin User" [ref=e794]:
                  - generic [ref=e795]:
                    - generic [ref=e796]: Apr 26, 2026, 01:43 AM
                    - generic [ref=e797]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e798]:
                  - generic [ref=e799]:
                    - button "Clone test case" [ref=e800]:
                      - img [ref=e801]
                    - button "Edit test case" [ref=e804]:
                      - img [ref=e805]
                    - button "Delete test case" [ref=e808]:
                      - img [ref=e809]
              - link "15 go to google.com Manual Add tags Completed No Runs 3 Apr 26, 2026, 01:30 AM by Admin User Clone test case Edit test case Delete test case" [ref=e812] [cursor=pointer]:
                - cell [ref=e813]:
                  - checkbox [ref=e814]
                - cell "15" [ref=e815]
                - cell "go to google.com Manual" [ref=e816]:
                  - generic [ref=e818]:
                    - generic [ref=e819]: go to google.com
                    - generic [ref=e820]:
                      - img [ref=e821]
                      - text: Manual
                - cell "Add tags" [ref=e824]:
                  - button "Add tags" [ref=e825]:
                    - generic [ref=e826]:
                      - img [ref=e827]
                      - text: Add tags
                - cell "Completed" [ref=e830]:
                  - generic [ref=e831]: Completed
                - cell "No Runs" [ref=e833]:
                  - generic [ref=e836]: No Runs
                - cell "3" [ref=e837]
                - cell "Apr 26, 2026, 01:30 AM by Admin User" [ref=e838]:
                  - generic [ref=e839]:
                    - generic [ref=e840]: Apr 26, 2026, 01:30 AM
                    - generic [ref=e841]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e842]:
                  - generic [ref=e843]:
                    - button "Clone test case" [ref=e844]:
                      - img [ref=e845]
                    - button "Edit test case" [ref=e848]:
                      - img [ref=e849]
                    - button "Delete test case" [ref=e852]:
                      - img [ref=e853]
              - link "16 Navigate to Google Homepage Manual Add tags Failed No Runs 0 Apr 26, 2026, 01:27 AM by Admin User Clone test case Edit test case Delete test case" [ref=e856] [cursor=pointer]:
                - cell [ref=e857]:
                  - checkbox [ref=e858]
                - cell "16" [ref=e859]
                - cell "Navigate to Google Homepage Manual" [ref=e860]:
                  - generic [ref=e862]:
                    - generic [ref=e863]: Navigate to Google Homepage
                    - generic [ref=e864]:
                      - img [ref=e865]
                      - text: Manual
                - cell "Add tags" [ref=e868]:
                  - button "Add tags" [ref=e869]:
                    - generic [ref=e870]:
                      - img [ref=e871]
                      - text: Add tags
                - cell "Failed" [ref=e874]:
                  - generic [ref=e875]: Failed
                - cell "No Runs" [ref=e877]:
                  - generic [ref=e880]: No Runs
                - cell "0" [ref=e881]
                - cell "Apr 26, 2026, 01:27 AM by Admin User" [ref=e882]:
                  - generic [ref=e883]:
                    - generic [ref=e884]: Apr 26, 2026, 01:27 AM
                    - generic [ref=e885]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e886]:
                  - generic [ref=e887]:
                    - button "Clone test case" [ref=e888]:
                      - img [ref=e889]
                    - button "Edit test case" [ref=e892]:
                      - img [ref=e893]
                    - button "Delete test case" [ref=e896]:
                      - img [ref=e897]
              - link "17 go to google.com Manual Add tags Failed No Runs 0 Apr 26, 2026, 01:26 AM by Admin User Clone test case Edit test case Delete test case" [ref=e900] [cursor=pointer]:
                - cell [ref=e901]:
                  - checkbox [ref=e902]
                - cell "17" [ref=e903]
                - cell "go to google.com Manual" [ref=e904]:
                  - generic [ref=e906]:
                    - generic [ref=e907]: go to google.com
                    - generic [ref=e908]:
                      - img [ref=e909]
                      - text: Manual
                - cell "Add tags" [ref=e912]:
                  - button "Add tags" [ref=e913]:
                    - generic [ref=e914]:
                      - img [ref=e915]
                      - text: Add tags
                - cell "Failed" [ref=e918]:
                  - generic [ref=e919]: Failed
                - cell "No Runs" [ref=e921]:
                  - generic [ref=e924]: No Runs
                - cell "0" [ref=e925]
                - cell "Apr 26, 2026, 01:26 AM by Admin User" [ref=e926]:
                  - generic [ref=e927]:
                    - generic [ref=e928]: Apr 26, 2026, 01:26 AM
                    - generic [ref=e929]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e930]:
                  - generic [ref=e931]:
                    - button "Clone test case" [ref=e932]:
                      - img [ref=e933]
                    - button "Edit test case" [ref=e936]:
                      - img [ref=e937]
                    - button "Delete test case" [ref=e940]:
                      - img [ref=e941]
              - link "18 go to google.com Manual Add tags Completed No Runs 5 Apr 26, 2026, 12:50 AM by Admin User Clone test case Edit test case Delete test case" [ref=e944] [cursor=pointer]:
                - cell [ref=e945]:
                  - checkbox [ref=e946]
                - cell "18" [ref=e947]
                - cell "go to google.com Manual" [ref=e948]:
                  - generic [ref=e950]:
                    - generic [ref=e951]: go to google.com
                    - generic [ref=e952]:
                      - img [ref=e953]
                      - text: Manual
                - cell "Add tags" [ref=e956]:
                  - button "Add tags" [ref=e957]:
                    - generic [ref=e958]:
                      - img [ref=e959]
                      - text: Add tags
                - cell "Completed" [ref=e962]:
                  - generic [ref=e963]: Completed
                - cell "No Runs" [ref=e965]:
                  - generic [ref=e968]: No Runs
                - cell "5" [ref=e969]
                - cell "Apr 26, 2026, 12:50 AM by Admin User" [ref=e970]:
                  - generic [ref=e971]:
                    - generic [ref=e972]: Apr 26, 2026, 12:50 AM
                    - generic [ref=e973]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e974]:
                  - generic [ref=e975]:
                    - button "Clone test case" [ref=e976]:
                      - img [ref=e977]
                    - button "Edit test case" [ref=e980]:
                      - img [ref=e981]
                    - button "Delete test case" [ref=e984]:
                      - img [ref=e985]
              - link "19 go to google.com Manual Add tags Stopped No Runs 9 Apr 25, 2026, 11:55 PM by Admin User Clone test case Edit test case Delete test case" [ref=e988] [cursor=pointer]:
                - cell [ref=e989]:
                  - checkbox [ref=e990]
                - cell "19" [ref=e991]
                - cell "go to google.com Manual" [ref=e992]:
                  - generic [ref=e994]:
                    - generic [ref=e995]: go to google.com
                    - generic [ref=e996]:
                      - img [ref=e997]
                      - text: Manual
                - cell "Add tags" [ref=e1000]:
                  - button "Add tags" [ref=e1001]:
                    - generic [ref=e1002]:
                      - img [ref=e1003]
                      - text: Add tags
                - cell "Stopped" [ref=e1006]:
                  - generic [ref=e1007]: Stopped
                - cell "No Runs" [ref=e1009]:
                  - generic [ref=e1012]: No Runs
                - cell "9" [ref=e1013]
                - cell "Apr 25, 2026, 11:55 PM by Admin User" [ref=e1014]:
                  - generic [ref=e1015]:
                    - generic [ref=e1016]: Apr 25, 2026, 11:55 PM
                    - generic [ref=e1017]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e1018]:
                  - generic [ref=e1019]:
                    - button "Clone test case" [ref=e1020]:
                      - img [ref=e1021]
                    - button "Edit test case" [ref=e1024]:
                      - img [ref=e1025]
                    - button "Delete test case" [ref=e1028]:
                      - img [ref=e1029]
              - link "20 Purchase any two items from Swag Labs at... Manual Add tags Completed Passed 2 0 10 Apr 25, 2026, 11:47 PM by Admin User Clone test case Edit test case Delete test case" [ref=e1032] [cursor=pointer]:
                - cell [ref=e1033]:
                  - checkbox [ref=e1034]
                - cell "20" [ref=e1035]
                - cell "Purchase any two items from Swag Labs at... Manual" [ref=e1036]:
                  - generic [ref=e1038]:
                    - generic [ref=e1039]: Purchase any two items from Swag Labs at...
                    - generic [ref=e1040]:
                      - img [ref=e1041]
                      - text: Manual
                - cell "Add tags" [ref=e1044]:
                  - button "Add tags" [ref=e1045]:
                    - generic [ref=e1046]:
                      - img [ref=e1047]
                      - text: Add tags
                - cell "Completed" [ref=e1050]:
                  - generic [ref=e1051]: Completed
                - cell "Passed 2 0" [ref=e1053]:
                  - generic [ref=e1054]:
                    - generic [ref=e1056]:
                      - img [ref=e1057]
                      - text: Passed
                    - generic [ref=e1060]:
                      - generic "Passed runs" [ref=e1061]: "2"
                      - generic "Failed runs" [ref=e1063]: "0"
                - cell "10" [ref=e1065]
                - cell "Apr 25, 2026, 11:47 PM by Admin User" [ref=e1066]:
                  - generic [ref=e1067]:
                    - generic [ref=e1068]: Apr 25, 2026, 11:47 PM
                    - generic [ref=e1069]: by Admin User
                - cell "Clone test case Edit test case Delete test case" [ref=e1070]:
                  - generic [ref=e1071]:
                    - button "Clone test case" [ref=e1072]:
                      - img [ref=e1073]
                    - button "Edit test case" [ref=e1076]:
                      - img [ref=e1077]
                    - button "Delete test case" [ref=e1080]:
                      - img [ref=e1081]
          - generic [ref=e1086]:
            - generic [ref=e1087]: 1–20 of 265 test cases
            - generic [ref=e1088]:
              - generic [ref=e1089]:
                - generic [ref=e1090]: Rows per page
                - combobox [ref=e1091] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e1092]
              - generic [ref=e1094]:
                - generic [ref=e1095]: Page 1of14
                - generic [ref=e1096]:
                  - button "First page" [disabled]:
                    - img
                  - button "Previous page" [disabled]:
                    - img
                  - button "Next page" [ref=e1097] [cursor=pointer]:
                    - img [ref=e1098]
                  - button "Last page" [ref=e1100] [cursor=pointer]:
                    - img [ref=e1101]
          - dialog [ref=e1104]:
            - generic [ref=e1106]:
              - generic [ref=e1107]:
                - generic [ref=e1108]:
                  - img [ref=e1109]
                  - heading "Create Test Case" [level=2] [ref=e1112]
                - button "Close" [active] [ref=e1113] [cursor=pointer]:
                  - img [ref=e1114]
              - generic [ref=e1117]:
                - paragraph [ref=e1118]: Enter the test case name. AI will use this name when generating and saving the test case.
                - generic [ref=e1119]:
                  - generic [ref=e1120]: Name *
                  - textbox "Name *" [ref=e1121]:
                    - /placeholder: My Test Case
                  - generic [ref=e1123]: 0/200
                - generic [ref=e1124]:
                  - generic [ref=e1125]: Description
                  - textbox "Description" [ref=e1126]:
                    - /placeholder: Optional description for this test case...
                  - generic [ref=e1128]: 0/5000
                - generic [ref=e1129]:
                  - button "Cancel" [ref=e1130] [cursor=pointer]
                  - button "Create" [disabled]
```

# Test source

```ts
  1   | import { test, expect, type Locator, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | // Authenticated via auth.setup. Storage state carries the user's currently
  5   | // selected organisation + project, which already places `/test-cases` inside
  6   | // the right scope. Tests don't switch orgs explicitly — the user spec asks
  7   | // for "Regression_test_success" but we honour whatever the storage state
  8   | // already has, since switching orgs is a separate concern (covered in nav).
  9   | test.use({ storageState: '.auth/user.json' })
  10  | 
  11  | // All test-case mutations land in the same account/project. Run serial so
  12  | // that two tests don't fight over the same list (search box, bulk-select,
  13  | // pagination state).
  14  | test.describe.configure({ mode: 'serial' })
  15  | 
  16  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  17  | const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  18  | 
  19  | // ============================================================
  20  | // Helpers — UI-only, no API helper calls. Each helper drives the SPA so
  21  | // the SUT's own client/SDK does the actual network work.
  22  | // ============================================================
  23  | 
  24  | async function gotoTestCases(page: Page): Promise<void> {
  25  |     await page.goto('/test-cases')
  26  |     await page
  27  |         .locator('input[placeholder="Search test cases…"]')
  28  |         .waitFor({ state: 'visible', timeout: 15_000 })
  29  |     // Wait for either rows or the empty-state to settle so the list is
  30  |     // stable before the test interacts with it.
  31  |     await page
  32  |         .locator('table tbody tr, text=No test cases found, text=Loading sessions…')
  33  |         .first()
  34  |         .waitFor({ state: 'visible', timeout: 10_000 })
  35  |         .catch(() => undefined)
  36  | }
  37  | 
  38  | async function openNewTestCaseDropdown(page: Page): Promise<void> {
  39  |     await page.locator('button[data-tour="new-test-case-btn"]').click()
  40  |     // The "AI Test Create" item is rendered conditionally on the dropdown
  41  |     // being open — wait for it before continuing.
  42  |     await page
  43  |         .locator('button[data-tour="ai-test-create"]')
  44  |         .waitFor({ state: 'visible', timeout: 5_000 })
  45  | }
  46  | 
  47  | async function uiCreateAITestCase(page: Page, name: string, description?: string): Promise<string> {
  48  |     await gotoTestCases(page)
  49  |     await openNewTestCaseDropdown(page)
  50  |     await page.locator('button[data-tour="ai-test-create"]').click()
  51  | 
  52  |     const dialog = page.locator('div[role="dialog"][data-tour="create-tc-modal"]')
> 53  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
      |                  ^ TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
  54  | 
  55  |     await dialog.locator('#test-case-name').fill(name)
  56  |     if (description) {
  57  |         await dialog.locator('#test-case-description').fill(description)
  58  |     }
  59  | 
  60  |     const [response] = await Promise.all([
  61  |         page.waitForResponse(
  62  |             r => /\/api\/analysis\/sessions\b/.test(r.url()) && r.request().method() === 'POST',
  63  |             { timeout: 15_000 },
  64  |         ),
  65  |         dialog.locator('button[type="submit"]', { hasText: /^Create$/ }).click(),
  66  |     ])
  67  |     if (!response.ok()) {
  68  |         const body = await response.text().catch(() => '')
  69  |         throw new Error(`createSession ${response.status()}: ${body.slice(0, 200)}`)
  70  |     }
  71  | 
  72  |     // SPA navigates to /test-analysis/<sessionId> on success. Pull the id
  73  |     // from the URL so callers can return to /test-cases and clean up.
  74  |     await page.waitForURL(/\/test-analysis\/[0-9a-f-]{8,}/i, { timeout: 12_000 })
  75  |     const match = page.url().match(/\/test-analysis\/([0-9a-f-]{8,})/i)
  76  |     if (!match) throw new Error(`Could not parse sessionId from ${page.url()}`)
  77  |     return match[1]
  78  | }
  79  | 
  80  | /**
  81  |  * Locate the row whose visible title equals `name`. Each row has a `tr`
  82  |  * wrapper carrying the `test-case-row` class; we anchor on the title cell
  83  |  * and climb to the row.
  84  |  */
  85  | function testCaseRow(page: Page, name: string): Locator {
  86  |     return page
  87  |         .locator('table tbody tr.test-case-row')
  88  |         .filter({ has: page.getByText(name, { exact: true }) })
  89  |         .first()
  90  | }
  91  | 
  92  | async function searchFor(page: Page, query: string): Promise<void> {
  93  |     const input = page.locator('input[placeholder="Search test cases…"]')
  94  |     await input.fill(query)
  95  |     // The list is server-side filtered after a 300ms debounce.
  96  |     await page.waitForTimeout(500)
  97  | }
  98  | 
  99  | async function clearSearch(page: Page): Promise<void> {
  100 |     const input = page.locator('input[placeholder="Search test cases…"]')
  101 |     await input.fill('')
  102 |     await page.waitForTimeout(500)
  103 | }
  104 | 
  105 | /**
  106 |  * Open the row's overflow actions and trigger a specific icon button.
  107 |  * The row's action cell exposes plain buttons with `aria-label`s like
  108 |  * "Clone test case", "Edit test case", "Delete test case".
  109 |  */
  110 | async function clickRowAction(
  111 |     row: Locator,
  112 |     action: 'Clone test case' | 'Edit test case' | 'Delete test case',
  113 | ): Promise<void> {
  114 |     // Hover the row so the actions cell becomes interactive in case CSS
  115 |     // hides it until hover (matches user behaviour).
  116 |     await row.hover()
  117 |     await row.locator(`button[aria-label="${action}"]`).click()
  118 | }
  119 | 
  120 | async function uiUpdateTestCase(
  121 |     page: Page,
  122 |     row: Locator,
  123 |     newTitle: string,
  124 |     newDescription?: string,
  125 | ): Promise<void> {
  126 |     await clickRowAction(row, 'Edit test case')
  127 | 
  128 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Edit Test Case' })
  129 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  130 | 
  131 |     await dialog.locator('#edit-test-case-name').fill(newTitle)
  132 |     if (newDescription !== undefined) {
  133 |         await dialog.locator('#edit-test-case-description').fill(newDescription)
  134 |     }
  135 | 
  136 |     await Promise.all([
  137 |         page.waitForResponse(
  138 |             r =>
  139 |                 /\/api\/analysis\/sessions\/[^/]+\/title\b/.test(r.url()) &&
  140 |                 r.request().method() === 'PATCH',
  141 |             { timeout: 10_000 },
  142 |         ),
  143 |         dialog.locator('button[type="submit"]', { hasText: /^Save$/ }).click(),
  144 |     ])
  145 | 
  146 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  147 | }
  148 | 
  149 | async function uiDeleteTestCase(page: Page, row: Locator): Promise<void> {
  150 |     await clickRowAction(row, 'Delete test case')
  151 | 
  152 |     // ConfirmationDialog uses role="alertdialog" (NOT role="dialog").
  153 |     const dialog = page.locator('div[role="alertdialog"]', { hasText: 'Delete Test Case' })
```