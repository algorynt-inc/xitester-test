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
Error: page.waitForTimeout: Test timeout of 30000ms exceeded.
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
              - button "Refresh" [ref=e143] [cursor=pointer]:
                - img [ref=e144]
                - text: Refresh
              - button "New Test Case" [ref=e150] [cursor=pointer]:
                - img [ref=e151]
                - text: New Test Case
                - img [ref=e152]
          - generic [ref=e155]:
            - generic [ref=e156]:
              - img [ref=e157]
              - textbox "Search test cases…" [active] [ref=e160]
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
          - table [ref=e184]:
            - rowgroup [ref=e185]:
              - row "# Title / Prompt Tags Analysis Status Last Run Steps Created Actions" [ref=e186]:
                - columnheader [ref=e187]:
                  - checkbox [ref=e188] [cursor=pointer]
                - columnheader "#" [ref=e189]
                - columnheader "Title / Prompt" [ref=e190]
                - columnheader "Tags" [ref=e191]
                - columnheader "Analysis Status" [ref=e192]
                - columnheader "Last Run" [ref=e193]
                - columnheader "Steps" [ref=e194]
                - columnheader "Created" [ref=e195]
                - columnheader "Actions" [ref=e196]
            - rowgroup [ref=e197]:
              - link "1 qa-src-1783512683750-fbjb Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 12:11 PM by ashid Clone test case Edit test case Delete test case" [ref=e198] [cursor=pointer]:
                - cell [ref=e199]:
                  - checkbox [ref=e200]
                - cell "1" [ref=e201]
                - cell "qa-src-1783512683750-fbjb Manual Source for clone" [ref=e202]:
                  - generic [ref=e203]:
                    - generic [ref=e204]:
                      - generic [ref=e205]: qa-src-1783512683750-fbjb
                      - generic [ref=e206]:
                        - img [ref=e207]
                        - text: Manual
                    - generic "Source for clone" [ref=e210]
                - cell "Add tags" [ref=e211]:
                  - button "Add tags" [ref=e212]:
                    - generic [ref=e213]:
                      - img [ref=e214]
                      - text: Add tags
                - cell "Idle" [ref=e217]:
                  - generic [ref=e218]: Idle
                - cell "No Runs" [ref=e220]:
                  - generic [ref=e223]: No Runs
                - cell "0" [ref=e224]
                - cell "Jul 8, 2026, 12:11 PM by ashid" [ref=e225]:
                  - generic [ref=e226]:
                    - generic [ref=e227]: Jul 8, 2026, 12:11 PM
                    - generic [ref=e228]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e229]:
                  - generic [ref=e230]:
                    - button "Clone test case" [ref=e231]:
                      - img [ref=e232]
                    - button "Edit test case" [ref=e235]:
                      - img [ref=e236]
                    - button "Delete test case" [ref=e239]:
                      - img [ref=e240]
              - link "2 qa-src-1783512650702-81bn Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 12:10 PM by ashid Clone test case Edit test case Delete test case" [ref=e243] [cursor=pointer]:
                - cell [ref=e244]:
                  - checkbox [ref=e245]
                - cell "2" [ref=e246]
                - cell "qa-src-1783512650702-81bn Manual Source for clone" [ref=e247]:
                  - generic [ref=e248]:
                    - generic [ref=e249]:
                      - generic [ref=e250]: qa-src-1783512650702-81bn
                      - generic [ref=e251]:
                        - img [ref=e252]
                        - text: Manual
                    - generic "Source for clone" [ref=e255]
                - cell "Add tags" [ref=e256]:
                  - button "Add tags" [ref=e257]:
                    - generic [ref=e258]:
                      - img [ref=e259]
                      - text: Add tags
                - cell "Idle" [ref=e262]:
                  - generic [ref=e263]: Idle
                - cell "No Runs" [ref=e265]:
                  - generic [ref=e268]: No Runs
                - cell "0" [ref=e269]
                - cell "Jul 8, 2026, 12:10 PM by ashid" [ref=e270]:
                  - generic [ref=e271]:
                    - generic [ref=e272]: Jul 8, 2026, 12:10 PM
                    - generic [ref=e273]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e274]:
                  - generic [ref=e275]:
                    - button "Clone test case" [ref=e276]:
                      - img [ref=e277]
                    - button "Edit test case" [ref=e280]:
                      - img [ref=e281]
                    - button "Delete test case" [ref=e284]:
                      - img [ref=e285]
              - link "3 qa-src-1783511656205-bz5h Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 11:54 AM by ashid Clone test case Edit test case Delete test case" [ref=e288] [cursor=pointer]:
                - cell [ref=e289]:
                  - checkbox [ref=e290]
                - cell "3" [ref=e291]
                - cell "qa-src-1783511656205-bz5h Manual Source for clone" [ref=e292]:
                  - generic [ref=e293]:
                    - generic [ref=e294]:
                      - generic [ref=e295]: qa-src-1783511656205-bz5h
                      - generic [ref=e296]:
                        - img [ref=e297]
                        - text: Manual
                    - generic "Source for clone" [ref=e300]
                - cell "Add tags" [ref=e301]:
                  - button "Add tags" [ref=e302]:
                    - generic [ref=e303]:
                      - img [ref=e304]
                      - text: Add tags
                - cell "Idle" [ref=e307]:
                  - generic [ref=e308]: Idle
                - cell "No Runs" [ref=e310]:
                  - generic [ref=e313]: No Runs
                - cell "0" [ref=e314]
                - cell "Jul 8, 2026, 11:54 AM by ashid" [ref=e315]:
                  - generic [ref=e316]:
                    - generic [ref=e317]: Jul 8, 2026, 11:54 AM
                    - generic [ref=e318]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e319]:
                  - generic [ref=e320]:
                    - button "Clone test case" [ref=e321]:
                      - img [ref=e322]
                    - button "Edit test case" [ref=e325]:
                      - img [ref=e326]
                    - button "Delete test case" [ref=e329]:
                      - img [ref=e330]
              - link "4 qa-rec-1783511346318-so59 Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 11:49 AM by ashid Clone test case Edit test case Delete test case" [ref=e333] [cursor=pointer]:
                - cell [ref=e334]:
                  - checkbox [ref=e335]
                - cell "4" [ref=e336]
                - cell "qa-rec-1783511346318-so59 Recorded" [ref=e337]:
                  - generic [ref=e339]:
                    - generic [ref=e340]: qa-rec-1783511346318-so59
                    - generic [ref=e341]:
                      - img [ref=e342]
                      - text: Recorded
                - cell "Add tags" [ref=e345]:
                  - button "Add tags" [ref=e346]:
                    - generic [ref=e347]:
                      - img [ref=e348]
                      - text: Add tags
                - cell "Ready to Record" [ref=e351]:
                  - generic [ref=e352]: Ready to Record
                - cell "No Runs" [ref=e354]:
                  - generic [ref=e357]: No Runs
                - cell "1" [ref=e358]
                - cell "Jul 8, 2026, 11:49 AM by ashid" [ref=e359]:
                  - generic [ref=e360]:
                    - generic [ref=e361]: Jul 8, 2026, 11:49 AM
                    - generic [ref=e362]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e363]:
                  - generic [ref=e364]:
                    - button "Clone test case" [ref=e365]:
                      - img [ref=e366]
                    - button "Edit test case" [ref=e369]:
                      - img [ref=e370]
                    - button "Delete test case" [ref=e373]:
                      - img [ref=e374]
              - link "5 qa-src-1783510739169-p4yx Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 11:39 AM by ashid Clone test case Edit test case Delete test case" [ref=e377] [cursor=pointer]:
                - cell [ref=e378]:
                  - checkbox [ref=e379]
                - cell "5" [ref=e380]
                - cell "qa-src-1783510739169-p4yx Manual Source for clone" [ref=e381]:
                  - generic [ref=e382]:
                    - generic [ref=e383]:
                      - generic [ref=e384]: qa-src-1783510739169-p4yx
                      - generic [ref=e385]:
                        - img [ref=e386]
                        - text: Manual
                    - generic "Source for clone" [ref=e389]
                - cell "Add tags" [ref=e390]:
                  - button "Add tags" [ref=e391]:
                    - generic [ref=e392]:
                      - img [ref=e393]
                      - text: Add tags
                - cell "Idle" [ref=e396]:
                  - generic [ref=e397]: Idle
                - cell "No Runs" [ref=e399]:
                  - generic [ref=e402]: No Runs
                - cell "0" [ref=e403]
                - cell "Jul 8, 2026, 11:39 AM by ashid" [ref=e404]:
                  - generic [ref=e405]:
                    - generic [ref=e406]: Jul 8, 2026, 11:39 AM
                    - generic [ref=e407]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e408]:
                  - generic [ref=e409]:
                    - button "Clone test case" [ref=e410]:
                      - img [ref=e411]
                    - button "Edit test case" [ref=e414]:
                      - img [ref=e415]
                    - button "Delete test case" [ref=e418]:
                      - img [ref=e419]
              - link "6 qa-tc78-20260708113754 Manual Add tags Plan Ready No Runs 0 Jul 8, 2026, 11:38 AM by ashid Clone test case Edit test case Delete test case" [ref=e422] [cursor=pointer]:
                - cell [ref=e423]:
                  - checkbox [ref=e424]
                - cell "6" [ref=e425]
                - cell "qa-tc78-20260708113754 Manual" [ref=e426]:
                  - generic [ref=e428]:
                    - generic [ref=e429]: qa-tc78-20260708113754
                    - generic [ref=e430]:
                      - img [ref=e431]
                      - text: Manual
                - cell "Add tags" [ref=e434]:
                  - button "Add tags" [ref=e435]:
                    - generic [ref=e436]:
                      - img [ref=e437]
                      - text: Add tags
                - cell "Plan Ready" [ref=e440]:
                  - generic [ref=e441]: Plan Ready
                - cell "No Runs" [ref=e443]:
                  - generic [ref=e446]: No Runs
                - cell "0" [ref=e447]
                - cell "Jul 8, 2026, 11:38 AM by ashid" [ref=e448]:
                  - generic [ref=e449]:
                    - generic [ref=e450]: Jul 8, 2026, 11:38 AM
                    - generic [ref=e451]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e452]:
                  - generic [ref=e453]:
                    - button "Clone test case" [ref=e454]:
                      - img [ref=e455]
                    - button "Edit test case" [ref=e458]:
                      - img [ref=e459]
                    - button "Delete test case" [ref=e462]:
                      - img [ref=e463]
              - link "7 qa-tc77-20260708113642 Manual Add tags Completed No Runs 3 Jul 8, 2026, 11:36 AM by ashid Clone test case Edit test case Delete test case" [ref=e466] [cursor=pointer]:
                - cell [ref=e467]:
                  - checkbox [ref=e468]
                - cell "7" [ref=e469]
                - cell "qa-tc77-20260708113642 Manual" [ref=e470]:
                  - generic [ref=e472]:
                    - generic [ref=e473]: qa-tc77-20260708113642
                    - generic [ref=e474]:
                      - img [ref=e475]
                      - text: Manual
                - cell "Add tags" [ref=e478]:
                  - button "Add tags" [ref=e479]:
                    - generic [ref=e480]:
                      - img [ref=e481]
                      - text: Add tags
                - cell "Completed" [ref=e484]:
                  - generic [ref=e485]: Completed
                - cell "No Runs" [ref=e487]:
                  - generic [ref=e490]: No Runs
                - cell "3" [ref=e491]
                - cell "Jul 8, 2026, 11:36 AM by ashid" [ref=e492]:
                  - generic [ref=e493]:
                    - generic [ref=e494]: Jul 8, 2026, 11:36 AM
                    - generic [ref=e495]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e496]:
                  - generic [ref=e497]:
                    - button "Clone test case" [ref=e498]:
                      - img [ref=e499]
                    - button "Edit test case" [ref=e502]:
                      - img [ref=e503]
                    - button "Delete test case" [ref=e506]:
                      - img [ref=e507]
              - link "8 qa-tc78-20260708113621 Manual Add tags Plan Ready No Runs 0 Jul 8, 2026, 11:36 AM by ashid Clone test case Edit test case Delete test case" [ref=e510] [cursor=pointer]:
                - cell [ref=e511]:
                  - checkbox [ref=e512]
                - cell "8" [ref=e513]
                - cell "qa-tc78-20260708113621 Manual" [ref=e514]:
                  - generic [ref=e516]:
                    - generic [ref=e517]: qa-tc78-20260708113621
                    - generic [ref=e518]:
                      - img [ref=e519]
                      - text: Manual
                - cell "Add tags" [ref=e522]:
                  - button "Add tags" [ref=e523]:
                    - generic [ref=e524]:
                      - img [ref=e525]
                      - text: Add tags
                - cell "Plan Ready" [ref=e528]:
                  - generic [ref=e529]: Plan Ready
                - cell "No Runs" [ref=e531]:
                  - generic [ref=e534]: No Runs
                - cell "0" [ref=e535]
                - cell "Jul 8, 2026, 11:36 AM by ashid" [ref=e536]:
                  - generic [ref=e537]:
                    - generic [ref=e538]: Jul 8, 2026, 11:36 AM
                    - generic [ref=e539]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e540]:
                  - generic [ref=e541]:
                    - button "Clone test case" [ref=e542]:
                      - img [ref=e543]
                    - button "Edit test case" [ref=e546]:
                      - img [ref=e547]
                    - button "Delete test case" [ref=e550]:
                      - img [ref=e551]
              - link "9 qa-tc77-20260708113508 Manual Add tags Completed No Runs 5 Jul 8, 2026, 11:35 AM by ashid Clone test case Edit test case Delete test case" [ref=e554] [cursor=pointer]:
                - cell [ref=e555]:
                  - checkbox [ref=e556]
                - cell "9" [ref=e557]
                - cell "qa-tc77-20260708113508 Manual" [ref=e558]:
                  - generic [ref=e560]:
                    - generic [ref=e561]: qa-tc77-20260708113508
                    - generic [ref=e562]:
                      - img [ref=e563]
                      - text: Manual
                - cell "Add tags" [ref=e566]:
                  - button "Add tags" [ref=e567]:
                    - generic [ref=e568]:
                      - img [ref=e569]
                      - text: Add tags
                - cell "Completed" [ref=e572]:
                  - generic [ref=e573]: Completed
                - cell "No Runs" [ref=e575]:
                  - generic [ref=e578]: No Runs
                - cell "5" [ref=e579]
                - cell "Jul 8, 2026, 11:35 AM by ashid" [ref=e580]:
                  - generic [ref=e581]:
                    - generic [ref=e582]: Jul 8, 2026, 11:35 AM
                    - generic [ref=e583]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e584]:
                  - generic [ref=e585]:
                    - button "Clone test case" [ref=e586]:
                      - img [ref=e587]
                    - button "Edit test case" [ref=e590]:
                      - img [ref=e591]
                    - button "Delete test case" [ref=e594]:
                      - img [ref=e595]
              - link "10 qa-rec-1783504270404-qjdd Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 09:51 AM by ashid Clone test case Edit test case Delete test case" [ref=e598] [cursor=pointer]:
                - cell [ref=e599]:
                  - checkbox [ref=e600]
                - cell "10" [ref=e601]
                - cell "qa-rec-1783504270404-qjdd Recorded" [ref=e602]:
                  - generic [ref=e604]:
                    - generic [ref=e605]: qa-rec-1783504270404-qjdd
                    - generic [ref=e606]:
                      - img [ref=e607]
                      - text: Recorded
                - cell "Add tags" [ref=e610]:
                  - button "Add tags" [ref=e611]:
                    - generic [ref=e612]:
                      - img [ref=e613]
                      - text: Add tags
                - cell "Ready to Record" [ref=e616]:
                  - generic [ref=e617]: Ready to Record
                - cell "No Runs" [ref=e619]:
                  - generic [ref=e622]: No Runs
                - cell "1" [ref=e623]
                - cell "Jul 8, 2026, 09:51 AM by ashid" [ref=e624]:
                  - generic [ref=e625]:
                    - generic [ref=e626]: Jul 8, 2026, 09:51 AM
                    - generic [ref=e627]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e628]:
                  - generic [ref=e629]:
                    - button "Clone test case" [ref=e630]:
                      - img [ref=e631]
                    - button "Edit test case" [ref=e634]:
                      - img [ref=e635]
                    - button "Delete test case" [ref=e638]:
                      - img [ref=e639]
              - link "11 qa-ai-1783503315776-lo7x Manual Created by Playwright TC-065 Add tags Idle No Runs 0 Jul 8, 2026, 09:35 AM by ashid Clone test case Edit test case Delete test case" [ref=e642] [cursor=pointer]:
                - cell [ref=e643]:
                  - checkbox [ref=e644]
                - cell "11" [ref=e645]
                - cell "qa-ai-1783503315776-lo7x Manual Created by Playwright TC-065" [ref=e646]:
                  - generic [ref=e647]:
                    - generic [ref=e648]:
                      - generic [ref=e649]: qa-ai-1783503315776-lo7x
                      - generic [ref=e650]:
                        - img [ref=e651]
                        - text: Manual
                    - generic "Created by Playwright TC-065" [ref=e654]
                - cell "Add tags" [ref=e655]:
                  - button "Add tags" [ref=e656]:
                    - generic [ref=e657]:
                      - img [ref=e658]
                      - text: Add tags
                - cell "Idle" [ref=e661]:
                  - generic [ref=e662]: Idle
                - cell "No Runs" [ref=e664]:
                  - generic [ref=e667]: No Runs
                - cell "0" [ref=e668]
                - cell "Jul 8, 2026, 09:35 AM by ashid" [ref=e669]:
                  - generic [ref=e670]:
                    - generic [ref=e671]: Jul 8, 2026, 09:35 AM
                    - generic [ref=e672]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e673]:
                  - generic [ref=e674]:
                    - button "Clone test case" [ref=e675]:
                      - img [ref=e676]
                    - button "Edit test case" [ref=e679]:
                      - img [ref=e680]
                    - button "Delete test case" [ref=e683]:
                      - img [ref=e684]
              - link "12 qa-tc77-20260708093515 Manual Add tags Plan Ready No Runs 0 Jul 8, 2026, 09:35 AM by ashid Clone test case Edit test case Delete test case" [ref=e687] [cursor=pointer]:
                - cell [ref=e688]:
                  - checkbox [ref=e689]
                - cell "12" [ref=e690]
                - cell "qa-tc77-20260708093515 Manual" [ref=e691]:
                  - generic [ref=e693]:
                    - generic [ref=e694]: qa-tc77-20260708093515
                    - generic [ref=e695]:
                      - img [ref=e696]
                      - text: Manual
                - cell "Add tags" [ref=e699]:
                  - button "Add tags" [ref=e700]:
                    - generic [ref=e701]:
                      - img [ref=e702]
                      - text: Add tags
                - cell "Plan Ready" [ref=e705]:
                  - generic [ref=e706]: Plan Ready
                - cell "No Runs" [ref=e708]:
                  - generic [ref=e711]: No Runs
                - cell "0" [ref=e712]
                - cell "Jul 8, 2026, 09:35 AM by ashid" [ref=e713]:
                  - generic [ref=e714]:
                    - generic [ref=e715]: Jul 8, 2026, 09:35 AM
                    - generic [ref=e716]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e717]:
                  - generic [ref=e718]:
                    - button "Clone test case" [ref=e719]:
                      - img [ref=e720]
                    - button "Edit test case" [ref=e723]:
                      - img [ref=e724]
                    - button "Delete test case" [ref=e727]:
                      - img [ref=e728]
              - link "13 qa-rec-1783496845141-uxh6 Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:47 AM by ashid Clone test case Edit test case Delete test case" [ref=e731] [cursor=pointer]:
                - cell [ref=e732]:
                  - checkbox [ref=e733]
                - cell "13" [ref=e734]
                - cell "qa-rec-1783496845141-uxh6 Recorded" [ref=e735]:
                  - generic [ref=e737]:
                    - generic [ref=e738]: qa-rec-1783496845141-uxh6
                    - generic [ref=e739]:
                      - img [ref=e740]
                      - text: Recorded
                - cell "Add tags" [ref=e743]:
                  - button "Add tags" [ref=e744]:
                    - generic [ref=e745]:
                      - img [ref=e746]
                      - text: Add tags
                - cell "Ready to Record" [ref=e749]:
                  - generic [ref=e750]: Ready to Record
                - cell "No Runs" [ref=e752]:
                  - generic [ref=e755]: No Runs
                - cell "1" [ref=e756]
                - cell "Jul 8, 2026, 07:47 AM by ashid" [ref=e757]:
                  - generic [ref=e758]:
                    - generic [ref=e759]: Jul 8, 2026, 07:47 AM
                    - generic [ref=e760]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e761]:
                  - generic [ref=e762]:
                    - button "Clone test case" [ref=e763]:
                      - img [ref=e764]
                    - button "Edit test case" [ref=e767]:
                      - img [ref=e768]
                    - button "Delete test case" [ref=e771]:
                      - img [ref=e772]
              - link "14 qa-rec-1783496571346-zh7e Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:42 AM by ashid Clone test case Edit test case Delete test case" [ref=e775] [cursor=pointer]:
                - cell [ref=e776]:
                  - checkbox [ref=e777]
                - cell "14" [ref=e778]
                - cell "qa-rec-1783496571346-zh7e Recorded" [ref=e779]:
                  - generic [ref=e781]:
                    - generic [ref=e782]: qa-rec-1783496571346-zh7e
                    - generic [ref=e783]:
                      - img [ref=e784]
                      - text: Recorded
                - cell "Add tags" [ref=e787]:
                  - button "Add tags" [ref=e788]:
                    - generic [ref=e789]:
                      - img [ref=e790]
                      - text: Add tags
                - cell "Ready to Record" [ref=e793]:
                  - generic [ref=e794]: Ready to Record
                - cell "No Runs" [ref=e796]:
                  - generic [ref=e799]: No Runs
                - cell "1" [ref=e800]
                - cell "Jul 8, 2026, 07:42 AM by ashid" [ref=e801]:
                  - generic [ref=e802]:
                    - generic [ref=e803]: Jul 8, 2026, 07:42 AM
                    - generic [ref=e804]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e805]:
                  - generic [ref=e806]:
                    - button "Clone test case" [ref=e807]:
                      - img [ref=e808]
                    - button "Edit test case" [ref=e811]:
                      - img [ref=e812]
                    - button "Delete test case" [ref=e815]:
                      - img [ref=e816]
              - 'link "15 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:39 AM by ashid Clone test case Edit test case Delete test case" [ref=e819] [cursor=pointer]':
                - cell [ref=e820]:
                  - checkbox [ref=e821]
                - cell "15" [ref=e822]
                - 'cell "Record: xitester.com Recorded" [ref=e823]':
                  - generic [ref=e825]:
                    - generic [ref=e826]: "Record: xitester.com"
                    - generic [ref=e827]:
                      - img [ref=e828]
                      - text: Recorded
                - cell "Add tags" [ref=e831]:
                  - button "Add tags" [ref=e832]:
                    - generic [ref=e833]:
                      - img [ref=e834]
                      - text: Add tags
                - cell "Ready to Record" [ref=e837]:
                  - generic [ref=e838]: Ready to Record
                - cell "No Runs" [ref=e840]:
                  - generic [ref=e843]: No Runs
                - cell "1" [ref=e844]
                - cell "Jul 8, 2026, 07:39 AM by ashid" [ref=e845]:
                  - generic [ref=e846]:
                    - generic [ref=e847]: Jul 8, 2026, 07:39 AM
                    - generic [ref=e848]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e849]:
                  - generic [ref=e850]:
                    - button "Clone test case" [ref=e851]:
                      - img [ref=e852]
                    - button "Edit test case" [ref=e855]:
                      - img [ref=e856]
                    - button "Delete test case" [ref=e859]:
                      - img [ref=e860]
              - link "16 qa-rec-1783496102283-phu4 Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:36 AM by ashid Clone test case Edit test case Delete test case" [ref=e863] [cursor=pointer]:
                - cell [ref=e864]:
                  - checkbox [ref=e865]
                - cell "16" [ref=e866]
                - cell "qa-rec-1783496102283-phu4 Recorded" [ref=e867]:
                  - generic [ref=e869]:
                    - generic [ref=e870]: qa-rec-1783496102283-phu4
                    - generic [ref=e871]:
                      - img [ref=e872]
                      - text: Recorded
                - cell "Add tags" [ref=e875]:
                  - button "Add tags" [ref=e876]:
                    - generic [ref=e877]:
                      - img [ref=e878]
                      - text: Add tags
                - cell "Ready to Record" [ref=e881]:
                  - generic [ref=e882]: Ready to Record
                - cell "No Runs" [ref=e884]:
                  - generic [ref=e887]: No Runs
                - cell "1" [ref=e888]
                - cell "Jul 8, 2026, 07:36 AM by ashid" [ref=e889]:
                  - generic [ref=e890]:
                    - generic [ref=e891]: Jul 8, 2026, 07:36 AM
                    - generic [ref=e892]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e893]:
                  - generic [ref=e894]:
                    - button "Clone test case" [ref=e895]:
                      - img [ref=e896]
                    - button "Edit test case" [ref=e899]:
                      - img [ref=e900]
                    - button "Delete test case" [ref=e903]:
                      - img [ref=e904]
              - link "17 qa-rec-1783496071663-jl0q Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:34 AM by ashid Clone test case Edit test case Delete test case" [ref=e907] [cursor=pointer]:
                - cell [ref=e908]:
                  - checkbox [ref=e909]
                - cell "17" [ref=e910]
                - cell "qa-rec-1783496071663-jl0q Recorded" [ref=e911]:
                  - generic [ref=e913]:
                    - generic [ref=e914]: qa-rec-1783496071663-jl0q
                    - generic [ref=e915]:
                      - img [ref=e916]
                      - text: Recorded
                - cell "Add tags" [ref=e919]:
                  - button "Add tags" [ref=e920]:
                    - generic [ref=e921]:
                      - img [ref=e922]
                      - text: Add tags
                - cell "Ready to Record" [ref=e925]:
                  - generic [ref=e926]: Ready to Record
                - cell "No Runs" [ref=e928]:
                  - generic [ref=e931]: No Runs
                - cell "1" [ref=e932]
                - cell "Jul 8, 2026, 07:34 AM by ashid" [ref=e933]:
                  - generic [ref=e934]:
                    - generic [ref=e935]: Jul 8, 2026, 07:34 AM
                    - generic [ref=e936]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e937]:
                  - generic [ref=e938]:
                    - button "Clone test case" [ref=e939]:
                      - img [ref=e940]
                    - button "Edit test case" [ref=e943]:
                      - img [ref=e944]
                    - button "Delete test case" [ref=e947]:
                      - img [ref=e948]
              - link "18 qa-rec-1783495971747-bhwd Recording Add tags Recording No Runs 1 Jul 8, 2026, 07:32 AM by ashid Clone test case Edit test case Delete test case" [ref=e951] [cursor=pointer]:
                - cell [ref=e952]:
                  - checkbox [ref=e953]
                - cell "18" [ref=e954]
                - cell "qa-rec-1783495971747-bhwd Recording" [ref=e955]:
                  - generic [ref=e957]:
                    - generic [ref=e958]: qa-rec-1783495971747-bhwd
                    - generic [ref=e959]:
                      - img [ref=e960]
                      - text: Recording
                - cell "Add tags" [ref=e963]:
                  - button "Add tags" [ref=e964]:
                    - generic [ref=e965]:
                      - img [ref=e966]
                      - text: Add tags
                - cell "Recording" [ref=e969]:
                  - generic [ref=e970]: Recording
                - cell "No Runs" [ref=e972]:
                  - generic [ref=e975]: No Runs
                - cell "1" [ref=e976]
                - cell "Jul 8, 2026, 07:32 AM by ashid" [ref=e977]:
                  - generic [ref=e978]:
                    - generic [ref=e979]: Jul 8, 2026, 07:32 AM
                    - generic [ref=e980]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e981]:
                  - generic [ref=e982]:
                    - button "Clone test case" [ref=e983]:
                      - img [ref=e984]
                    - button "Edit test case" [ref=e987]:
                      - img [ref=e988]
                    - button "Delete test case" [ref=e991]:
                      - img [ref=e992]
              - link "19 qa-bulk-C-1783495575093-mv9j Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:26 AM by ashid Clone test case Edit test case Delete test case" [ref=e995] [cursor=pointer]:
                - cell [ref=e996]:
                  - checkbox [ref=e997]
                - cell "19" [ref=e998]
                - cell "qa-bulk-C-1783495575093-mv9j Manual" [ref=e999]:
                  - generic [ref=e1001]:
                    - generic [ref=e1002]: qa-bulk-C-1783495575093-mv9j
                    - generic [ref=e1003]:
                      - img [ref=e1004]
                      - text: Manual
                - cell "Add tags" [ref=e1007]:
                  - button "Add tags" [ref=e1008]:
                    - generic [ref=e1009]:
                      - img [ref=e1010]
                      - text: Add tags
                - cell "Idle" [ref=e1013]:
                  - generic [ref=e1014]: Idle
                - cell "No Runs" [ref=e1016]:
                  - generic [ref=e1019]: No Runs
                - cell "0" [ref=e1020]
                - cell "Jul 8, 2026, 07:26 AM by ashid" [ref=e1021]:
                  - generic [ref=e1022]:
                    - generic [ref=e1023]: Jul 8, 2026, 07:26 AM
                    - generic [ref=e1024]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e1025]:
                  - generic [ref=e1026]:
                    - button "Clone test case" [ref=e1027]:
                      - img [ref=e1028]
                    - button "Edit test case" [ref=e1031]:
                      - img [ref=e1032]
                    - button "Delete test case" [ref=e1035]:
                      - img [ref=e1036]
              - link "20 qa-bulk-B-1783495575093-vu60 Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:26 AM by ashid Clone test case Edit test case Delete test case" [ref=e1039] [cursor=pointer]:
                - cell [ref=e1040]:
                  - checkbox [ref=e1041]
                - cell "20" [ref=e1042]
                - cell "qa-bulk-B-1783495575093-vu60 Manual" [ref=e1043]:
                  - generic [ref=e1045]:
                    - generic [ref=e1046]: qa-bulk-B-1783495575093-vu60
                    - generic [ref=e1047]:
                      - img [ref=e1048]
                      - text: Manual
                - cell "Add tags" [ref=e1051]:
                  - button "Add tags" [ref=e1052]:
                    - generic [ref=e1053]:
                      - img [ref=e1054]
                      - text: Add tags
                - cell "Idle" [ref=e1057]:
                  - generic [ref=e1058]: Idle
                - cell "No Runs" [ref=e1060]:
                  - generic [ref=e1063]: No Runs
                - cell "0" [ref=e1064]
                - cell "Jul 8, 2026, 07:26 AM by ashid" [ref=e1065]:
                  - generic [ref=e1066]:
                    - generic [ref=e1067]: Jul 8, 2026, 07:26 AM
                    - generic [ref=e1068]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e1069]:
                  - generic [ref=e1070]:
                    - button "Clone test case" [ref=e1071]:
                      - img [ref=e1072]
                    - button "Edit test case" [ref=e1075]:
                      - img [ref=e1076]
                    - button "Delete test case" [ref=e1079]:
                      - img [ref=e1080]
          - generic [ref=e1085]:
            - generic [ref=e1086]: 1–20 of 409 test cases
            - generic [ref=e1087]:
              - generic [ref=e1088]:
                - generic [ref=e1089]: Rows per page
                - combobox [ref=e1090] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e1091]
              - generic [ref=e1093]:
                - generic [ref=e1094]: Page 1of21
                - generic [ref=e1095]:
                  - button "First page" [disabled]:
                    - img
                  - button "Previous page" [disabled]:
                    - img
                  - button "Next page" [ref=e1096] [cursor=pointer]:
                    - img [ref=e1097]
                  - button "Last page" [ref=e1099] [cursor=pointer]:
                    - img [ref=e1100]
```

# Test source

```ts
  10  | 
  11  | // All test-case mutations land in the same account/project. Run serial so
  12  | // that two tests don't fight over the same list (search box, bulk-select,
  13  | // pagination state).
  14  | test.describe.configure({ mode: 'serial' })
  15  | 
  16  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  17  | // const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  18  | const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  19  | 
  20  | // ============================================================
  21  | // Helpers — UI-only, no API helper calls. Each helper drives the SPA so
  22  | // the SUT's own client/SDK does the actual network work.
  23  | // ============================================================
  24  | 
  25  | async function gotoTestCases(page: Page): Promise<void> {
  26  |     await page.goto('/test-cases')
  27  |     await page
  28  |         .locator('input[placeholder="Search test cases…"]')
  29  |         .waitFor({ state: 'visible', timeout: 15_000 })
  30  |     // Wait for either rows or the empty-state to settle so the list is
  31  |     // stable before the test interacts with it.
  32  |     await page
  33  |         .locator('table tbody tr, text=No test cases found, text=Loading sessions…')
  34  |         .first()
  35  |         .waitFor({ state: 'visible', timeout: 10_000 })
  36  |         .catch(() => undefined)
  37  | }
  38  | 
  39  | async function openNewTestCaseDropdown(page: Page): Promise<void> {
  40  |     await page.locator('button[data-tour="new-test-case-btn"]').click()
  41  |     // The "AI Test Create" item is rendered conditionally on the dropdown
  42  |     // being open — wait for it before continuing.
  43  |     await page
  44  |         .locator('button[data-tour="ai-test-create"]')
  45  |         .waitFor({ state: 'visible', timeout: 5_000 })
  46  | }
  47  | 
  48  | async function uiCreateAITestCase(page: Page, name: string, description?: string): Promise<string> {
  49  |     await gotoTestCases(page)
  50  |     await openNewTestCaseDropdown(page)
  51  |     await page.locator('button[data-tour="ai-test-create"]').click()
  52  | 
  53  |     // The modal renders <div role="dialog">…<div data-tour="create-tc-modal">…</div>…</div>
  54  |     // — `data-tour` is on a CHILD, not on the role=dialog element. Match the
  55  |     // outer dialog by visible heading instead.
  56  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Create Test Case' })
  57  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  58  | 
  59  |     await dialog.locator('#test-case-name').fill(name)
  60  |     if (description) {
  61  |         await dialog.locator('#test-case-description').fill(description)
  62  |     }
  63  | 
  64  |     const [response] = await Promise.all([
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
> 110 |     await page.waitForTimeout(5000)
      |                ^ Error: page.waitForTimeout: Test timeout of 30000ms exceeded.
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
  165 |         page.waitForResponse(
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
```