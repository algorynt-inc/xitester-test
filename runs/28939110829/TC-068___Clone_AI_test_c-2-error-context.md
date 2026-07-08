# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-068 — Clone AI test case
- Location: tests/test-cases.spec.ts:291:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
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
          - 'button "Switch project. Current project: Default Project" [ref=e24] [cursor=pointer]':
            - img [ref=e25]
            - generic [ref=e27]: Default Project
            - img [ref=e28]
      - generic [ref=e31]:
        - button "Search... ⌘K" [ref=e32] [cursor=pointer]:
          - img [ref=e33]
          - generic [ref=e36]: Search...
          - generic [ref=e37]: ⌘K
        - generic [ref=e38]:
          - button "Help" [ref=e39] [cursor=pointer]:
            - img [ref=e40]
          - button "Notifications" [ref=e43] [cursor=pointer]:
            - img [ref=e44]
            - generic [ref=e47]: 99+
        - generic [ref=e49]:
          - generic [ref=e50]: DEV
          - generic [ref=e51]: v1.1.4
          - button "A" [ref=e52] [cursor=pointer]
    - generic [ref=e53]:
      - complementary:
        - navigation [ref=e54]:
          - button "Dashboard" [ref=e55] [cursor=pointer]:
            - img [ref=e57]
            - generic: Dashboard
          - button "Test Cases" [ref=e62] [cursor=pointer]:
            - img [ref=e64]
            - generic: Test Cases
          - button "Test Plans" [ref=e67] [cursor=pointer]:
            - img [ref=e69]
            - generic: Test Plans
          - button "Discovery" [ref=e73] [cursor=pointer]:
            - img [ref=e75]
            - generic: Discovery
          - button "Test Plan AI" [ref=e82] [cursor=pointer]:
            - img [ref=e84]
            - generic: Test Plan AI
          - button "Test Data" [ref=e96] [cursor=pointer]:
            - img [ref=e98]
            - generic: Test Data
          - button "Quality" [ref=e102] [cursor=pointer]:
            - img [ref=e104]
            - generic: Quality
          - button "Api Tester" [ref=e107] [cursor=pointer]:
            - img [ref=e109]
            - generic: Api Tester
          - button "Reports" [ref=e113] [cursor=pointer]:
            - img [ref=e115]
            - generic: Reports
          - button "Settings" [ref=e119] [cursor=pointer]:
            - img [ref=e121]
            - generic: Settings
        - button "Logout" [ref=e126] [cursor=pointer]:
          - img [ref=e128]
          - generic: Logout
      - main [ref=e132]:
        - generic [ref=e133]:
          - generic [ref=e134]:
            - generic [ref=e135]:
              - heading "Test Cases" [level=1] [ref=e136]
              - paragraph [ref=e137]: View and manage your test case analysis sessions
            - generic [ref=e138]:
              - button "Import" [ref=e139] [cursor=pointer]:
                - img [ref=e140]
                - text: Import
              - button "Refresh" [disabled] [ref=e143]:
                - img [ref=e144]
                - text: Refresh
              - button "New Test Case" [ref=e150] [cursor=pointer]:
                - img [ref=e151]
                - text: New Test Case
                - img [ref=e152]
          - generic [ref=e155]:
            - generic [ref=e156]:
              - img [ref=e157]
              - textbox "Search test cases…" [ref=e160]: qa-src-1783510814042-klw4
            - tablist "Session type" [ref=e161]:
              - tab "Test Cases" [selected] [ref=e162] [cursor=pointer]
              - tab "Test Modules" [ref=e163] [cursor=pointer]
            - button "Status" [ref=e164] [cursor=pointer]:
              - img [ref=e165]
              - text: Status
            - button "Last Run" [ref=e167] [cursor=pointer]:
              - img [ref=e168]
              - text: Last Run
            - button "Created By" [ref=e170] [cursor=pointer]:
              - img [ref=e171]
              - text: Created By
            - button "Tags" [ref=e173] [cursor=pointer]:
              - img [ref=e174]
              - text: Tags
            - button "Test Plan" [ref=e176] [cursor=pointer]:
              - img [ref=e177]
              - text: Test Plan
            - button "Source" [ref=e179] [cursor=pointer]:
              - img [ref=e180]
              - text: Source
            - button "Reset" [ref=e182] [cursor=pointer]:
              - img [ref=e183]
              - text: Reset
          - table [ref=e188]:
            - rowgroup [ref=e189]:
              - row "# Title / Prompt Tags Analysis Status Last Run Steps Created Actions" [ref=e190]:
                - columnheader [ref=e191]:
                  - checkbox [ref=e192] [cursor=pointer]
                - columnheader "#" [ref=e193]
                - columnheader "Title / Prompt" [ref=e194]
                - columnheader "Tags" [ref=e195]
                - columnheader "Analysis Status" [ref=e196]
                - columnheader "Last Run" [ref=e197]
                - columnheader "Steps" [ref=e198]
                - columnheader "Created" [ref=e199]
                - columnheader "Actions" [ref=e200]
            - rowgroup [ref=e201]:
              - link "1 qa-src-1783510814042-klw4 Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 11:40 AM by ashid Clone test case Edit test case Delete test case" [ref=e202] [cursor=pointer]:
                - cell [ref=e203]:
                  - checkbox [ref=e204]
                - cell "1" [ref=e205]
                - cell "qa-src-1783510814042-klw4 Manual Source for clone" [ref=e206]:
                  - generic [ref=e207]:
                    - generic [ref=e208]:
                      - generic [ref=e209]: qa-src-1783510814042-klw4
                      - generic [ref=e210]:
                        - img [ref=e211]
                        - text: Manual
                    - generic "Source for clone" [ref=e214]
                - cell "Add tags" [ref=e215]:
                  - button "Add tags" [ref=e216]:
                    - generic [ref=e217]:
                      - img [ref=e218]
                      - text: Add tags
                - cell "Idle" [ref=e221]:
                  - generic [ref=e222]: Idle
                - cell "No Runs" [ref=e224]:
                  - generic [ref=e227]: No Runs
                - cell "0" [ref=e228]
                - cell "Jul 8, 2026, 11:40 AM by ashid" [ref=e229]:
                  - generic [ref=e230]:
                    - generic [ref=e231]: Jul 8, 2026, 11:40 AM
                    - generic [ref=e232]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e233]:
                  - generic [ref=e234]:
                    - button "Clone test case" [ref=e235]:
                      - img [ref=e236]
                    - button "Edit test case" [ref=e239]:
                      - img [ref=e240]
                    - button "Delete test case" [ref=e243]:
                      - img [ref=e244]
              - link "2 qa-src-1783510739169-p4yx Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 11:39 AM by ashid Clone test case Edit test case Delete test case" [ref=e247] [cursor=pointer]:
                - cell [ref=e248]:
                  - checkbox [ref=e249]
                - cell "2" [ref=e250]
                - cell "qa-src-1783510739169-p4yx Manual Source for clone" [ref=e251]:
                  - generic [ref=e252]:
                    - generic [ref=e253]:
                      - generic [ref=e254]: qa-src-1783510739169-p4yx
                      - generic [ref=e255]:
                        - img [ref=e256]
                        - text: Manual
                    - generic "Source for clone" [ref=e259]
                - cell "Add tags" [ref=e260]:
                  - button "Add tags" [ref=e261]:
                    - generic [ref=e262]:
                      - img [ref=e263]
                      - text: Add tags
                - cell "Idle" [ref=e266]:
                  - generic [ref=e267]: Idle
                - cell "No Runs" [ref=e269]:
                  - generic [ref=e272]: No Runs
                - cell "0" [ref=e273]
                - cell "Jul 8, 2026, 11:39 AM by ashid" [ref=e274]:
                  - generic [ref=e275]:
                    - generic [ref=e276]: Jul 8, 2026, 11:39 AM
                    - generic [ref=e277]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e278]:
                  - generic [ref=e279]:
                    - button "Clone test case" [ref=e280]:
                      - img [ref=e281]
                    - button "Edit test case" [ref=e284]:
                      - img [ref=e285]
                    - button "Delete test case" [ref=e288]:
                      - img [ref=e289]
              - link "3 qa-tc78-20260708113754 Manual Add tags Plan Ready No Runs 0 Jul 8, 2026, 11:38 AM by ashid Clone test case Edit test case Delete test case" [ref=e292] [cursor=pointer]:
                - cell [ref=e293]:
                  - checkbox [ref=e294]
                - cell "3" [ref=e295]
                - cell "qa-tc78-20260708113754 Manual" [ref=e296]:
                  - generic [ref=e298]:
                    - generic [ref=e299]: qa-tc78-20260708113754
                    - generic [ref=e300]:
                      - img [ref=e301]
                      - text: Manual
                - cell "Add tags" [ref=e304]:
                  - button "Add tags" [ref=e305]:
                    - generic [ref=e306]:
                      - img [ref=e307]
                      - text: Add tags
                - cell "Plan Ready" [ref=e310]:
                  - generic [ref=e311]: Plan Ready
                - cell "No Runs" [ref=e313]:
                  - generic [ref=e316]: No Runs
                - cell "0" [ref=e317]
                - cell "Jul 8, 2026, 11:38 AM by ashid" [ref=e318]:
                  - generic [ref=e319]:
                    - generic [ref=e320]: Jul 8, 2026, 11:38 AM
                    - generic [ref=e321]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e322]:
                  - generic [ref=e323]:
                    - button "Clone test case" [ref=e324]:
                      - img [ref=e325]
                    - button "Edit test case" [ref=e328]:
                      - img [ref=e329]
                    - button "Delete test case" [ref=e332]:
                      - img [ref=e333]
              - link "4 qa-tc77-20260708113642 Manual Add tags Completed No Runs 3 Jul 8, 2026, 11:36 AM by ashid Clone test case Edit test case Delete test case" [ref=e336] [cursor=pointer]:
                - cell [ref=e337]:
                  - checkbox [ref=e338]
                - cell "4" [ref=e339]
                - cell "qa-tc77-20260708113642 Manual" [ref=e340]:
                  - generic [ref=e342]:
                    - generic [ref=e343]: qa-tc77-20260708113642
                    - generic [ref=e344]:
                      - img [ref=e345]
                      - text: Manual
                - cell "Add tags" [ref=e348]:
                  - button "Add tags" [ref=e349]:
                    - generic [ref=e350]:
                      - img [ref=e351]
                      - text: Add tags
                - cell "Completed" [ref=e354]:
                  - generic [ref=e355]: Completed
                - cell "No Runs" [ref=e357]:
                  - generic [ref=e360]: No Runs
                - cell "3" [ref=e361]
                - cell "Jul 8, 2026, 11:36 AM by ashid" [ref=e362]:
                  - generic [ref=e363]:
                    - generic [ref=e364]: Jul 8, 2026, 11:36 AM
                    - generic [ref=e365]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e366]:
                  - generic [ref=e367]:
                    - button "Clone test case" [ref=e368]:
                      - img [ref=e369]
                    - button "Edit test case" [ref=e372]:
                      - img [ref=e373]
                    - button "Delete test case" [ref=e376]:
                      - img [ref=e377]
              - link "5 qa-tc78-20260708113621 Manual Add tags Plan Ready No Runs 0 Jul 8, 2026, 11:36 AM by ashid Clone test case Edit test case Delete test case" [ref=e380] [cursor=pointer]:
                - cell [ref=e381]:
                  - checkbox [ref=e382]
                - cell "5" [ref=e383]
                - cell "qa-tc78-20260708113621 Manual" [ref=e384]:
                  - generic [ref=e386]:
                    - generic [ref=e387]: qa-tc78-20260708113621
                    - generic [ref=e388]:
                      - img [ref=e389]
                      - text: Manual
                - cell "Add tags" [ref=e392]:
                  - button "Add tags" [ref=e393]:
                    - generic [ref=e394]:
                      - img [ref=e395]
                      - text: Add tags
                - cell "Plan Ready" [ref=e398]:
                  - generic [ref=e399]: Plan Ready
                - cell "No Runs" [ref=e401]:
                  - generic [ref=e404]: No Runs
                - cell "0" [ref=e405]
                - cell "Jul 8, 2026, 11:36 AM by ashid" [ref=e406]:
                  - generic [ref=e407]:
                    - generic [ref=e408]: Jul 8, 2026, 11:36 AM
                    - generic [ref=e409]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e410]:
                  - generic [ref=e411]:
                    - button "Clone test case" [ref=e412]:
                      - img [ref=e413]
                    - button "Edit test case" [ref=e416]:
                      - img [ref=e417]
                    - button "Delete test case" [ref=e420]:
                      - img [ref=e421]
              - link "6 qa-tc77-20260708113508 Manual Add tags Completed No Runs 5 Jul 8, 2026, 11:35 AM by ashid Clone test case Edit test case Delete test case" [ref=e424] [cursor=pointer]:
                - cell [ref=e425]:
                  - checkbox [ref=e426]
                - cell "6" [ref=e427]
                - cell "qa-tc77-20260708113508 Manual" [ref=e428]:
                  - generic [ref=e430]:
                    - generic [ref=e431]: qa-tc77-20260708113508
                    - generic [ref=e432]:
                      - img [ref=e433]
                      - text: Manual
                - cell "Add tags" [ref=e436]:
                  - button "Add tags" [ref=e437]:
                    - generic [ref=e438]:
                      - img [ref=e439]
                      - text: Add tags
                - cell "Completed" [ref=e442]:
                  - generic [ref=e443]: Completed
                - cell "No Runs" [ref=e445]:
                  - generic [ref=e448]: No Runs
                - cell "5" [ref=e449]
                - cell "Jul 8, 2026, 11:35 AM by ashid" [ref=e450]:
                  - generic [ref=e451]:
                    - generic [ref=e452]: Jul 8, 2026, 11:35 AM
                    - generic [ref=e453]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e454]:
                  - generic [ref=e455]:
                    - button "Clone test case" [ref=e456]:
                      - img [ref=e457]
                    - button "Edit test case" [ref=e460]:
                      - img [ref=e461]
                    - button "Delete test case" [ref=e464]:
                      - img [ref=e465]
              - link "7 qa-rec-1783504270404-qjdd Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 09:51 AM by ashid Clone test case Edit test case Delete test case" [ref=e468] [cursor=pointer]:
                - cell [ref=e469]:
                  - checkbox [ref=e470]
                - cell "7" [ref=e471]
                - cell "qa-rec-1783504270404-qjdd Recorded" [ref=e472]:
                  - generic [ref=e474]:
                    - generic [ref=e475]: qa-rec-1783504270404-qjdd
                    - generic [ref=e476]:
                      - img [ref=e477]
                      - text: Recorded
                - cell "Add tags" [ref=e480]:
                  - button "Add tags" [ref=e481]:
                    - generic [ref=e482]:
                      - img [ref=e483]
                      - text: Add tags
                - cell "Ready to Record" [ref=e486]:
                  - generic [ref=e487]: Ready to Record
                - cell "No Runs" [ref=e489]:
                  - generic [ref=e492]: No Runs
                - cell "1" [ref=e493]
                - cell "Jul 8, 2026, 09:51 AM by ashid" [ref=e494]:
                  - generic [ref=e495]:
                    - generic [ref=e496]: Jul 8, 2026, 09:51 AM
                    - generic [ref=e497]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e498]:
                  - generic [ref=e499]:
                    - button "Clone test case" [ref=e500]:
                      - img [ref=e501]
                    - button "Edit test case" [ref=e504]:
                      - img [ref=e505]
                    - button "Delete test case" [ref=e508]:
                      - img [ref=e509]
              - link "8 qa-ai-1783503315776-lo7x Manual Created by Playwright TC-065 Add tags Idle No Runs 0 Jul 8, 2026, 09:35 AM by ashid Clone test case Edit test case Delete test case" [ref=e512] [cursor=pointer]:
                - cell [ref=e513]:
                  - checkbox [ref=e514]
                - cell "8" [ref=e515]
                - cell "qa-ai-1783503315776-lo7x Manual Created by Playwright TC-065" [ref=e516]:
                  - generic [ref=e517]:
                    - generic [ref=e518]:
                      - generic [ref=e519]: qa-ai-1783503315776-lo7x
                      - generic [ref=e520]:
                        - img [ref=e521]
                        - text: Manual
                    - generic "Created by Playwright TC-065" [ref=e524]
                - cell "Add tags" [ref=e525]:
                  - button "Add tags" [ref=e526]:
                    - generic [ref=e527]:
                      - img [ref=e528]
                      - text: Add tags
                - cell "Idle" [ref=e531]:
                  - generic [ref=e532]: Idle
                - cell "No Runs" [ref=e534]:
                  - generic [ref=e537]: No Runs
                - cell "0" [ref=e538]
                - cell "Jul 8, 2026, 09:35 AM by ashid" [ref=e539]:
                  - generic [ref=e540]:
                    - generic [ref=e541]: Jul 8, 2026, 09:35 AM
                    - generic [ref=e542]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e543]:
                  - generic [ref=e544]:
                    - button "Clone test case" [ref=e545]:
                      - img [ref=e546]
                    - button "Edit test case" [ref=e549]:
                      - img [ref=e550]
                    - button "Delete test case" [ref=e553]:
                      - img [ref=e554]
              - link "9 qa-tc77-20260708093515 Manual Add tags Plan Ready No Runs 0 Jul 8, 2026, 09:35 AM by ashid Clone test case Edit test case Delete test case" [ref=e557] [cursor=pointer]:
                - cell [ref=e558]:
                  - checkbox [ref=e559]
                - cell "9" [ref=e560]
                - cell "qa-tc77-20260708093515 Manual" [ref=e561]:
                  - generic [ref=e563]:
                    - generic [ref=e564]: qa-tc77-20260708093515
                    - generic [ref=e565]:
                      - img [ref=e566]
                      - text: Manual
                - cell "Add tags" [ref=e569]:
                  - button "Add tags" [ref=e570]:
                    - generic [ref=e571]:
                      - img [ref=e572]
                      - text: Add tags
                - cell "Plan Ready" [ref=e575]:
                  - generic [ref=e576]: Plan Ready
                - cell "No Runs" [ref=e578]:
                  - generic [ref=e581]: No Runs
                - cell "0" [ref=e582]
                - cell "Jul 8, 2026, 09:35 AM by ashid" [ref=e583]:
                  - generic [ref=e584]:
                    - generic [ref=e585]: Jul 8, 2026, 09:35 AM
                    - generic [ref=e586]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e587]:
                  - generic [ref=e588]:
                    - button "Clone test case" [ref=e589]:
                      - img [ref=e590]
                    - button "Edit test case" [ref=e593]:
                      - img [ref=e594]
                    - button "Delete test case" [ref=e597]:
                      - img [ref=e598]
              - link "10 qa-rec-1783496845141-uxh6 Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:47 AM by ashid Clone test case Edit test case Delete test case" [ref=e601] [cursor=pointer]:
                - cell [ref=e602]:
                  - checkbox [ref=e603]
                - cell "10" [ref=e604]
                - cell "qa-rec-1783496845141-uxh6 Recorded" [ref=e605]:
                  - generic [ref=e607]:
                    - generic [ref=e608]: qa-rec-1783496845141-uxh6
                    - generic [ref=e609]:
                      - img [ref=e610]
                      - text: Recorded
                - cell "Add tags" [ref=e613]:
                  - button "Add tags" [ref=e614]:
                    - generic [ref=e615]:
                      - img [ref=e616]
                      - text: Add tags
                - cell "Ready to Record" [ref=e619]:
                  - generic [ref=e620]: Ready to Record
                - cell "No Runs" [ref=e622]:
                  - generic [ref=e625]: No Runs
                - cell "1" [ref=e626]
                - cell "Jul 8, 2026, 07:47 AM by ashid" [ref=e627]:
                  - generic [ref=e628]:
                    - generic [ref=e629]: Jul 8, 2026, 07:47 AM
                    - generic [ref=e630]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e631]:
                  - generic [ref=e632]:
                    - button "Clone test case" [ref=e633]:
                      - img [ref=e634]
                    - button "Edit test case" [ref=e637]:
                      - img [ref=e638]
                    - button "Delete test case" [ref=e641]:
                      - img [ref=e642]
              - link "11 qa-rec-1783496571346-zh7e Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:42 AM by ashid Clone test case Edit test case Delete test case" [ref=e645] [cursor=pointer]:
                - cell [ref=e646]:
                  - checkbox [ref=e647]
                - cell "11" [ref=e648]
                - cell "qa-rec-1783496571346-zh7e Recorded" [ref=e649]:
                  - generic [ref=e651]:
                    - generic [ref=e652]: qa-rec-1783496571346-zh7e
                    - generic [ref=e653]:
                      - img [ref=e654]
                      - text: Recorded
                - cell "Add tags" [ref=e657]:
                  - button "Add tags" [ref=e658]:
                    - generic [ref=e659]:
                      - img [ref=e660]
                      - text: Add tags
                - cell "Ready to Record" [ref=e663]:
                  - generic [ref=e664]: Ready to Record
                - cell "No Runs" [ref=e666]:
                  - generic [ref=e669]: No Runs
                - cell "1" [ref=e670]
                - cell "Jul 8, 2026, 07:42 AM by ashid" [ref=e671]:
                  - generic [ref=e672]:
                    - generic [ref=e673]: Jul 8, 2026, 07:42 AM
                    - generic [ref=e674]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e675]:
                  - generic [ref=e676]:
                    - button "Clone test case" [ref=e677]:
                      - img [ref=e678]
                    - button "Edit test case" [ref=e681]:
                      - img [ref=e682]
                    - button "Delete test case" [ref=e685]:
                      - img [ref=e686]
              - 'link "12 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:39 AM by ashid Clone test case Edit test case Delete test case" [ref=e689] [cursor=pointer]':
                - cell [ref=e690]:
                  - checkbox [ref=e691]
                - cell "12" [ref=e692]
                - 'cell "Record: xitester.com Recorded" [ref=e693]':
                  - generic [ref=e695]:
                    - generic [ref=e696]: "Record: xitester.com"
                    - generic [ref=e697]:
                      - img [ref=e698]
                      - text: Recorded
                - cell "Add tags" [ref=e701]:
                  - button "Add tags" [ref=e702]:
                    - generic [ref=e703]:
                      - img [ref=e704]
                      - text: Add tags
                - cell "Ready to Record" [ref=e707]:
                  - generic [ref=e708]: Ready to Record
                - cell "No Runs" [ref=e710]:
                  - generic [ref=e713]: No Runs
                - cell "1" [ref=e714]
                - cell "Jul 8, 2026, 07:39 AM by ashid" [ref=e715]:
                  - generic [ref=e716]:
                    - generic [ref=e717]: Jul 8, 2026, 07:39 AM
                    - generic [ref=e718]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e719]:
                  - generic [ref=e720]:
                    - button "Clone test case" [ref=e721]:
                      - img [ref=e722]
                    - button "Edit test case" [ref=e725]:
                      - img [ref=e726]
                    - button "Delete test case" [ref=e729]:
                      - img [ref=e730]
              - link "13 qa-rec-1783496102283-phu4 Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:36 AM by ashid Clone test case Edit test case Delete test case" [ref=e733] [cursor=pointer]:
                - cell [ref=e734]:
                  - checkbox [ref=e735]
                - cell "13" [ref=e736]
                - cell "qa-rec-1783496102283-phu4 Recorded" [ref=e737]:
                  - generic [ref=e739]:
                    - generic [ref=e740]: qa-rec-1783496102283-phu4
                    - generic [ref=e741]:
                      - img [ref=e742]
                      - text: Recorded
                - cell "Add tags" [ref=e745]:
                  - button "Add tags" [ref=e746]:
                    - generic [ref=e747]:
                      - img [ref=e748]
                      - text: Add tags
                - cell "Ready to Record" [ref=e751]:
                  - generic [ref=e752]: Ready to Record
                - cell "No Runs" [ref=e754]:
                  - generic [ref=e757]: No Runs
                - cell "1" [ref=e758]
                - cell "Jul 8, 2026, 07:36 AM by ashid" [ref=e759]:
                  - generic [ref=e760]:
                    - generic [ref=e761]: Jul 8, 2026, 07:36 AM
                    - generic [ref=e762]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e763]:
                  - generic [ref=e764]:
                    - button "Clone test case" [ref=e765]:
                      - img [ref=e766]
                    - button "Edit test case" [ref=e769]:
                      - img [ref=e770]
                    - button "Delete test case" [ref=e773]:
                      - img [ref=e774]
              - link "14 qa-rec-1783496071663-jl0q Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:34 AM by ashid Clone test case Edit test case Delete test case" [ref=e777] [cursor=pointer]:
                - cell [ref=e778]:
                  - checkbox [ref=e779]
                - cell "14" [ref=e780]
                - cell "qa-rec-1783496071663-jl0q Recorded" [ref=e781]:
                  - generic [ref=e783]:
                    - generic [ref=e784]: qa-rec-1783496071663-jl0q
                    - generic [ref=e785]:
                      - img [ref=e786]
                      - text: Recorded
                - cell "Add tags" [ref=e789]:
                  - button "Add tags" [ref=e790]:
                    - generic [ref=e791]:
                      - img [ref=e792]
                      - text: Add tags
                - cell "Ready to Record" [ref=e795]:
                  - generic [ref=e796]: Ready to Record
                - cell "No Runs" [ref=e798]:
                  - generic [ref=e801]: No Runs
                - cell "1" [ref=e802]
                - cell "Jul 8, 2026, 07:34 AM by ashid" [ref=e803]:
                  - generic [ref=e804]:
                    - generic [ref=e805]: Jul 8, 2026, 07:34 AM
                    - generic [ref=e806]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e807]:
                  - generic [ref=e808]:
                    - button "Clone test case" [ref=e809]:
                      - img [ref=e810]
                    - button "Edit test case" [ref=e813]:
                      - img [ref=e814]
                    - button "Delete test case" [ref=e817]:
                      - img [ref=e818]
              - link "15 qa-rec-1783495971747-bhwd Recording Add tags Recording No Runs 1 Jul 8, 2026, 07:32 AM by ashid Clone test case Edit test case Delete test case" [ref=e821] [cursor=pointer]:
                - cell [ref=e822]:
                  - checkbox [ref=e823]
                - cell "15" [ref=e824]
                - cell "qa-rec-1783495971747-bhwd Recording" [ref=e825]:
                  - generic [ref=e827]:
                    - generic [ref=e828]: qa-rec-1783495971747-bhwd
                    - generic [ref=e829]:
                      - img [ref=e830]
                      - text: Recording
                - cell "Add tags" [ref=e833]:
                  - button "Add tags" [ref=e834]:
                    - generic [ref=e835]:
                      - img [ref=e836]
                      - text: Add tags
                - cell "Recording" [ref=e839]:
                  - generic [ref=e840]: Recording
                - cell "No Runs" [ref=e842]:
                  - generic [ref=e845]: No Runs
                - cell "1" [ref=e846]
                - cell "Jul 8, 2026, 07:32 AM by ashid" [ref=e847]:
                  - generic [ref=e848]:
                    - generic [ref=e849]: Jul 8, 2026, 07:32 AM
                    - generic [ref=e850]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e851]:
                  - generic [ref=e852]:
                    - button "Clone test case" [ref=e853]:
                      - img [ref=e854]
                    - button "Edit test case" [ref=e857]:
                      - img [ref=e858]
                    - button "Delete test case" [ref=e861]:
                      - img [ref=e862]
              - link "16 qa-bulk-C-1783495575093-mv9j Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:26 AM by ashid Clone test case Edit test case Delete test case" [ref=e865] [cursor=pointer]:
                - cell [ref=e866]:
                  - checkbox [ref=e867]
                - cell "16" [ref=e868]
                - cell "qa-bulk-C-1783495575093-mv9j Manual" [ref=e869]:
                  - generic [ref=e871]:
                    - generic [ref=e872]: qa-bulk-C-1783495575093-mv9j
                    - generic [ref=e873]:
                      - img [ref=e874]
                      - text: Manual
                - cell "Add tags" [ref=e877]:
                  - button "Add tags" [ref=e878]:
                    - generic [ref=e879]:
                      - img [ref=e880]
                      - text: Add tags
                - cell "Idle" [ref=e883]:
                  - generic [ref=e884]: Idle
                - cell "No Runs" [ref=e886]:
                  - generic [ref=e889]: No Runs
                - cell "0" [ref=e890]
                - cell "Jul 8, 2026, 07:26 AM by ashid" [ref=e891]:
                  - generic [ref=e892]:
                    - generic [ref=e893]: Jul 8, 2026, 07:26 AM
                    - generic [ref=e894]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e895]:
                  - generic [ref=e896]:
                    - button "Clone test case" [ref=e897]:
                      - img [ref=e898]
                    - button "Edit test case" [ref=e901]:
                      - img [ref=e902]
                    - button "Delete test case" [ref=e905]:
                      - img [ref=e906]
              - link "17 qa-bulk-B-1783495575093-vu60 Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:26 AM by ashid Clone test case Edit test case Delete test case" [ref=e909] [cursor=pointer]:
                - cell [ref=e910]:
                  - checkbox [ref=e911]
                - cell "17" [ref=e912]
                - cell "qa-bulk-B-1783495575093-vu60 Manual" [ref=e913]:
                  - generic [ref=e915]:
                    - generic [ref=e916]: qa-bulk-B-1783495575093-vu60
                    - generic [ref=e917]:
                      - img [ref=e918]
                      - text: Manual
                - cell "Add tags" [ref=e921]:
                  - button "Add tags" [ref=e922]:
                    - generic [ref=e923]:
                      - img [ref=e924]
                      - text: Add tags
                - cell "Idle" [ref=e927]:
                  - generic [ref=e928]: Idle
                - cell "No Runs" [ref=e930]:
                  - generic [ref=e933]: No Runs
                - cell "0" [ref=e934]
                - cell "Jul 8, 2026, 07:26 AM by ashid" [ref=e935]:
                  - generic [ref=e936]:
                    - generic [ref=e937]: Jul 8, 2026, 07:26 AM
                    - generic [ref=e938]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e939]:
                  - generic [ref=e940]:
                    - button "Clone test case" [ref=e941]:
                      - img [ref=e942]
                    - button "Edit test case" [ref=e945]:
                      - img [ref=e946]
                    - button "Delete test case" [ref=e949]:
                      - img [ref=e950]
              - link "18 qa-bulk-A-1783495575093-h472 Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:26 AM by ashid Clone test case Edit test case Delete test case" [ref=e953] [cursor=pointer]:
                - cell [ref=e954]:
                  - checkbox [ref=e955]
                - cell "18" [ref=e956]
                - cell "qa-bulk-A-1783495575093-h472 Manual" [ref=e957]:
                  - generic [ref=e959]:
                    - generic [ref=e960]: qa-bulk-A-1783495575093-h472
                    - generic [ref=e961]:
                      - img [ref=e962]
                      - text: Manual
                - cell "Add tags" [ref=e965]:
                  - button "Add tags" [ref=e966]:
                    - generic [ref=e967]:
                      - img [ref=e968]
                      - text: Add tags
                - cell "Idle" [ref=e971]:
                  - generic [ref=e972]: Idle
                - cell "No Runs" [ref=e974]:
                  - generic [ref=e977]: No Runs
                - cell "0" [ref=e978]
                - cell "Jul 8, 2026, 07:26 AM by ashid" [ref=e979]:
                  - generic [ref=e980]:
                    - generic [ref=e981]: Jul 8, 2026, 07:26 AM
                    - generic [ref=e982]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e983]:
                  - generic [ref=e984]:
                    - button "Clone test case" [ref=e985]:
                      - img [ref=e986]
                    - button "Edit test case" [ref=e989]:
                      - img [ref=e990]
                    - button "Delete test case" [ref=e993]:
                      - img [ref=e994]
              - link "19 qa-bulk-C-1783494884314-rdc9 Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:14 AM by ashid Clone test case Edit test case Delete test case" [ref=e997] [cursor=pointer]:
                - cell [ref=e998]:
                  - checkbox [ref=e999]
                - cell "19" [ref=e1000]
                - cell "qa-bulk-C-1783494884314-rdc9 Manual" [ref=e1001]:
                  - generic [ref=e1003]:
                    - generic [ref=e1004]: qa-bulk-C-1783494884314-rdc9
                    - generic [ref=e1005]:
                      - img [ref=e1006]
                      - text: Manual
                - cell "Add tags" [ref=e1009]:
                  - button "Add tags" [ref=e1010]:
                    - generic [ref=e1011]:
                      - img [ref=e1012]
                      - text: Add tags
                - cell "Idle" [ref=e1015]:
                  - generic [ref=e1016]: Idle
                - cell "No Runs" [ref=e1018]:
                  - generic [ref=e1021]: No Runs
                - cell "0" [ref=e1022]
                - cell "Jul 8, 2026, 07:14 AM by ashid" [ref=e1023]:
                  - generic [ref=e1024]:
                    - generic [ref=e1025]: Jul 8, 2026, 07:14 AM
                    - generic [ref=e1026]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e1027]:
                  - generic [ref=e1028]:
                    - button "Clone test case" [ref=e1029]:
                      - img [ref=e1030]
                    - button "Edit test case" [ref=e1033]:
                      - img [ref=e1034]
                    - button "Delete test case" [ref=e1037]:
                      - img [ref=e1038]
              - link "20 qa-bulk-B-1783494884314-rdc9 Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:14 AM by ashid Clone test case Edit test case Delete test case" [ref=e1041] [cursor=pointer]:
                - cell [ref=e1042]:
                  - checkbox [ref=e1043]
                - cell "20" [ref=e1044]
                - cell "qa-bulk-B-1783494884314-rdc9 Manual" [ref=e1045]:
                  - generic [ref=e1047]:
                    - generic [ref=e1048]: qa-bulk-B-1783494884314-rdc9
                    - generic [ref=e1049]:
                      - img [ref=e1050]
                      - text: Manual
                - cell "Add tags" [ref=e1053]:
                  - button "Add tags" [ref=e1054]:
                    - generic [ref=e1055]:
                      - img [ref=e1056]
                      - text: Add tags
                - cell "Idle" [ref=e1059]:
                  - generic [ref=e1060]: Idle
                - cell "No Runs" [ref=e1062]:
                  - generic [ref=e1065]: No Runs
                - cell "0" [ref=e1066]
                - cell "Jul 8, 2026, 07:14 AM by ashid" [ref=e1067]:
                  - generic [ref=e1068]:
                    - generic [ref=e1069]: Jul 8, 2026, 07:14 AM
                    - generic [ref=e1070]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e1071]:
                  - generic [ref=e1072]:
                    - button "Clone test case" [ref=e1073]:
                      - img [ref=e1074]
                    - button "Edit test case" [ref=e1077]:
                      - img [ref=e1078]
                    - button "Delete test case" [ref=e1081]:
                      - img [ref=e1082]
          - generic [ref=e1087]:
            - generic [ref=e1088]: 1–20 of 406 test cases
            - generic [ref=e1089]:
              - generic [ref=e1090]:
                - generic [ref=e1091]: Rows per page
                - combobox [ref=e1092] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e1093]
              - generic [ref=e1095]:
                - generic [ref=e1096]: Page 1of21
                - generic [ref=e1097]:
                  - button "First page" [disabled]:
                    - img
                  - button "Previous page" [disabled]:
                    - img
                  - button "Next page" [ref=e1098] [cursor=pointer]:
                    - img [ref=e1099]
                  - button "Last page" [ref=e1101] [cursor=pointer]:
                    - img [ref=e1102]
          - alertdialog "Delete Test Case" [ref=e1107]:
            - button "Close" [disabled] [ref=e1108]:
              - img [ref=e1109]
            - generic [ref=e1112]:
              - img [ref=e1114]
              - heading "Delete Test Case" [level=2] [ref=e1117]
              - generic [ref=e1118]:
                - text: Are you sure you want to delete
                - strong [ref=e1119]: qa-src-1783510814042-klw4
                - text: "? This action cannot be undone."
              - generic [ref=e1120]:
                - button "Cancel" [disabled] [ref=e1121]
                - button "Processing..." [disabled] [ref=e1122]
```

# Test source

```ts
  65  |         page.waitForResponse(
  66  |             r => /\/api\/analysis\/sessions\b/.test(r.url()) && r.request().method() === 'POST',
  67  |             { timeout: 15_000 },
  68  |         ),
  69  |         dialog.locator('button[type="submit"]', { hasText: /^Create$/ }).click(),
  70  |     ])
  71  |     if (!response.ok()) {
  72  |         const body = await response.text().catch(() => '')
  73  |         throw new Error(`createSession ${response.status()}: ${body.slice(0, 200)}`)
  74  |     }
  75  |     // SPA navigates to /test-analysis/<sessionId> on success. Pull the id
  76  |     // from the URL so callers can return to /test-cases and clean up.
  77  |     await page.waitForURL(/\/test-analysis\/[0-9a-f-]{8,}/i, { timeout: 10_000 })
  78  |     const match = page.url().match(/\/test-analysis\/([0-9a-f-]{8,})/i)
  79  |     if (!match) throw new Error(`Could not parse sessionId from ${page.url()}`)
  80  |     return match[1]
  81  | 
  82  | }
  83  | 
  84  | /**
  85  |  * Locate the row whose visible title equals `name`. Each row has a `tr`
  86  |  * wrapper carrying the `test-case-row` class; we anchor on the title cell
  87  |  * and climb to the row.
  88  |  */
  89  | function testCaseRow(page: Page, name: string): Locator {
  90  |     return page
  91  |         .locator('table tbody tr.test-case-row')
  92  |         .filter({ has: page.getByText(name, { exact: true }) })
  93  |         .first()
  94  | }
  95  | 
  96  | async function searchFor(page: Page, query: string): Promise<void> {
  97  |     const input = page.locator('input[placeholder="Search test cases…"]')
  98  |     await expect(input).toBeVisible()
  99  |     await input.fill(query)
  100 |     await expect(input).toHaveValue(query)
  101 |     // The list is server-side filtered after a 300ms debounce.
  102 |     await expect(
  103 |         page.locator('table tbody tr.test-case-row').filter({ hasText: query })
  104 |     ).toBeVisible({ timeout: 20_000 });
  105 | }
  106 | 
  107 | async function clearSearch(page: Page): Promise<void> {
  108 |     const input = page.locator('input[placeholder="Search test cases…"]')
  109 |     await input.fill('')
  110 |     await page.waitForTimeout(5000)
  111 | }
  112 | 
  113 | /**
  114 |  * Open the row's overflow actions and trigger a specific icon button.
  115 |  * The row's action cell exposes plain buttons with `aria-label`s like
  116 |  * "Clone test case", "Edit test case", "Delete test case".
  117 |  */
  118 | async function clickRowAction(
  119 |     row: Locator,
  120 |     action: 'Clone test case' | 'Edit test case' | 'Delete test case',
  121 | ): Promise<void> {
  122 |     // Hover the row so the actions cell becomes interactive in case CSS
  123 |     // hides it until hover (matches user behaviour).
  124 |     await row.hover()
  125 |     await row.locator(`button[aria-label="${action}"]`).click()
  126 | }
  127 | 
  128 | async function uiUpdateTestCase(
  129 |     page: Page,
  130 |     row: Locator,
  131 |     newTitle: string,
  132 |     newDescription?: string,
  133 | ): Promise<void> {
  134 |     await clickRowAction(row, 'Edit test case')
  135 | 
  136 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Edit Test Case' })
  137 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  138 | 
  139 |     await dialog.locator('#edit-test-case-name').fill(newTitle)
  140 |     if (newDescription !== undefined) {
  141 |         await dialog.locator('#edit-test-case-description').fill(newDescription)
  142 |     }
  143 | 
  144 |     await Promise.all([
  145 |         page.waitForResponse(
  146 |             r =>
  147 |                 /\/api\/analysis\/sessions\/[^/]+\/title\b/.test(r.url()) &&
  148 |                 r.request().method() === 'PATCH',
  149 |             { timeout: 10_000 },
  150 |         ),
  151 |         dialog.locator('button[type="submit"]', { hasText: /^Save$/ }).click(),
  152 |     ])
  153 | 
  154 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  155 | }
  156 | 
  157 | async function uiDeleteTestCase(page: Page, row: Locator): Promise<void> {
  158 |     await clickRowAction(row, 'Delete test case')
  159 | 
  160 |     // ConfirmationDialog uses role="alertdialog" (NOT role="dialog").
  161 |     const dialog = page.locator('div[role="alertdialog"]', { hasText: 'Delete Test Case' })
  162 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  163 | 
  164 |     await Promise.all([
> 165 |         page.waitForResponse(
      |              ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
  166 |             r =>
  167 |                 /\/api\/analysis\/sessions\/[^/]+$/.test(r.url()) &&
  168 |                 r.request().method() === 'DELETE',
  169 |             { timeout: 10_000 },
  170 |         ),
  171 |         dialog.locator('button', { hasText: /^Delete$/ }).first().click(),
  172 |     ])
  173 | 
  174 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  175 | }
  176 | 
  177 | async function uiCloneTestCase(page: Page, row: Locator, newTitle: string): Promise<void> {
  178 |     await clickRowAction(row, 'Clone test case')
  179 | 
  180 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Clone Test Case' })
  181 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  182 | 
  183 |     await dialog.locator('#cloneTitle').fill(newTitle)
  184 | 
  185 |     await Promise.all([
  186 |         page.waitForResponse(
  187 |             r =>
  188 |                 /\/api\/analysis\/sessions\/[^/]+\/clone\b/.test(r.url()) &&
  189 |                 r.request().method() === 'POST',
  190 |             { timeout: 15_000 },
  191 |         ),
  192 |         dialog.locator('button[type="submit"]', { hasText: /^Clone$/ }).click(),
  193 |     ])
  194 | 
  195 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  196 | }
  197 | 
  198 | async function uiCreateRecordTestCase(page: Page, name: string): Promise<void> {
  199 |     await gotoTestCases(page)
  200 |     await openNewTestCaseDropdown(page)
  201 |     await page.locator('button', { hasText: 'Record Test Case' }).click()
  202 | 
  203 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Record Test Case' })
  204 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  205 | 
  206 |     await dialog.locator('#recordTestName').fill(name)
  207 |     await dialog.locator('#recordTestDescription').fill('Created by Playwright TC-069')
  208 |     await dialog.locator('#startUrl').fill('https://xitester.com')
  209 | 
  210 |     await dialog.locator('button[type="submit"]', { hasText: /Start Recording/ }).click()
  211 |     await page.waitForTimeout(5000)
  212 | 
  213 |     // SPA navigates to /test-analysis with state {mode:'record', startUrl, initialTitle}.
  214 |     await page.waitForURL(/\/test-analysis(\?|$|#|\/)/, { timeout: 10_000 })
  215 |     expect(page.url()).toMatch(/\/test-analysis/)
  216 |     await expect(page.getByText('Ready to Record')).toBeVisible();
  217 | }
  218 | 
  219 | // ============================================================
  220 | // Tests — preserve user-supplied numbering TC-065 .. TC-076
  221 | // ============================================================
  222 | 
  223 | test('TC-065 — Create AI test case with name and description', async ({ page }) => {
  224 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  225 |     const name = `qa-ai-${ts()}`
  226 | 
  227 |     const sessionId = await uiCreateAITestCase(page, name, 'Created by Playwright TC-065')
  228 | 
  229 |     // Step 7 — verify navigation to test analysis page.
  230 |     expect(page.url()).toMatch(new RegExp(`/test-analysis/${sessionId}`))
  231 |     await expect(page.getByText('Start a test')).toBeVisible({
  232 |         timeout: 30_000,
  233 |     });
  234 | 
  235 |     // Verify it's listed when we go back.
  236 |     await gotoTestCases(page)
  237 |     await searchFor(page, name)
  238 |     await expect(testCaseRow(page, name)).toBeVisible({ timeout: 8_000 })
  239 | 
  240 |     // Cleanup so the project ends clean.
  241 |     await uiDeleteTestCase(page, testCaseRow(page, name))
  242 | })
  243 | 
  244 | test('TC-066 — Update existing AI test case name and description', async ({ page }) => {
  245 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  246 |     const original = `qa-ai-${ts()}`
  247 |     const renamed = `qa-renamed-${ts()}`
  248 | 
  249 |     await uiCreateAITestCase(page, original, 'Original description')
  250 |     await gotoTestCases(page)
  251 |     await searchFor(page, original)
  252 |     const row = testCaseRow(page, original)
  253 |     await expect(row).toBeVisible({ timeout: 8_000 })
  254 | 
  255 |     await uiUpdateTestCase(page, row, renamed, 'Edited by Playwright TC-066')
  256 | 
  257 |     // Verify success toast + new name visible after edit.
  258 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  259 |         /test case updated/i,
  260 |         { timeout: 5_000 },
  261 |     )
  262 |     await clearSearch(page)
  263 |     await searchFor(page, renamed)
  264 |     await expect(testCaseRow(page, renamed)).toBeVisible({ timeout: 8_000 })
  265 |     await expect(page.getByText(original, { exact: true })).toBeHidden()
```