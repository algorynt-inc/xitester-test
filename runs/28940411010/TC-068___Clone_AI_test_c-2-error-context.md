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
  - region "Notifications alt+T":
    - list:
      - listitem [ref=e3]:
        - button "Close toast" [ref=e4] [cursor=pointer]:
          - img [ref=e5]
        - img [ref=e9]
        - generic [ref=e13]: Test case deleted
  - generic [ref=e14]:
    - banner [ref=e15]:
      - generic [ref=e16]:
        - img "Xitester" [ref=e18]
        - generic [ref=e19]:
          - generic [ref=e20]: /
          - generic [ref=e21]:
            - button "XiTester Enterprise" [ref=e22] [cursor=pointer]:
              - img [ref=e23]
              - generic [ref=e27]: XiTester
              - generic [ref=e28]: Enterprise
            - button [ref=e29] [cursor=pointer]:
              - img [ref=e30]
          - generic [ref=e33]: /
          - 'button "Switch project. Current project: Default Project" [ref=e35] [cursor=pointer]':
            - img [ref=e36]
            - generic [ref=e38]: Default Project
            - img [ref=e39]
      - generic [ref=e42]:
        - button "Search... ⌘K" [ref=e43] [cursor=pointer]:
          - img [ref=e44]
          - generic [ref=e47]: Search...
          - generic [ref=e48]: ⌘K
        - generic [ref=e49]:
          - button "Help" [ref=e50] [cursor=pointer]:
            - img [ref=e51]
          - button "Notifications" [ref=e54] [cursor=pointer]:
            - img [ref=e55]
            - generic [ref=e58]: 99+
        - generic [ref=e60]:
          - generic [ref=e61]: DEV
          - generic [ref=e62]: v1.1.4
          - button "A" [ref=e63] [cursor=pointer]
    - generic [ref=e64]:
      - complementary:
        - navigation [ref=e65]:
          - button "Dashboard" [ref=e66] [cursor=pointer]:
            - img [ref=e68]
            - generic: Dashboard
          - button "Test Cases" [ref=e73] [cursor=pointer]:
            - img [ref=e75]
            - generic: Test Cases
          - button "Test Plans" [ref=e78] [cursor=pointer]:
            - img [ref=e80]
            - generic: Test Plans
          - button "Discovery" [ref=e84] [cursor=pointer]:
            - img [ref=e86]
            - generic: Discovery
          - button "Test Plan AI" [ref=e93] [cursor=pointer]:
            - img [ref=e95]
            - generic: Test Plan AI
          - button "Test Data" [ref=e107] [cursor=pointer]:
            - img [ref=e109]
            - generic: Test Data
          - button "Quality" [ref=e113] [cursor=pointer]:
            - img [ref=e115]
            - generic: Quality
          - button "Api Tester" [ref=e118] [cursor=pointer]:
            - img [ref=e120]
            - generic: Api Tester
          - button "Reports" [ref=e124] [cursor=pointer]:
            - img [ref=e126]
            - generic: Reports
          - button "Settings" [ref=e130] [cursor=pointer]:
            - img [ref=e132]
            - generic: Settings
        - button "Logout" [ref=e137] [cursor=pointer]:
          - img [ref=e139]
          - generic: Logout
      - main [ref=e143]:
        - generic [ref=e144]:
          - generic [ref=e145]:
            - generic [ref=e146]:
              - heading "Test Cases" [level=1] [ref=e147]
              - paragraph [ref=e148]: View and manage your test case analysis sessions
            - generic [ref=e149]:
              - button "Import" [ref=e150] [cursor=pointer]:
                - img [ref=e151]
                - text: Import
              - button "Refresh" [ref=e154] [cursor=pointer]:
                - img [ref=e155]
                - text: Refresh
              - button "New Test Case" [ref=e161] [cursor=pointer]:
                - img [ref=e162]
                - text: New Test Case
                - img [ref=e163]
          - generic [ref=e166]:
            - generic [ref=e167]:
              - img [ref=e168]
              - textbox "Search test cases…" [active] [ref=e171]
            - tablist "Session type" [ref=e172]:
              - tab "Test Cases" [selected] [ref=e173] [cursor=pointer]
              - tab "Test Modules" [ref=e174] [cursor=pointer]
            - button "Status" [ref=e175] [cursor=pointer]:
              - img [ref=e176]
              - text: Status
            - button "Last Run" [ref=e178] [cursor=pointer]:
              - img [ref=e179]
              - text: Last Run
            - button "Created By" [ref=e181] [cursor=pointer]:
              - img [ref=e182]
              - text: Created By
            - button "Tags" [ref=e184] [cursor=pointer]:
              - img [ref=e185]
              - text: Tags
            - button "Test Plan" [ref=e187] [cursor=pointer]:
              - img [ref=e188]
              - text: Test Plan
            - button "Source" [ref=e190] [cursor=pointer]:
              - img [ref=e191]
              - text: Source
          - table [ref=e195]:
            - rowgroup [ref=e196]:
              - row "# Title / Prompt Tags Analysis Status Last Run Steps Created Actions" [ref=e197]:
                - columnheader [ref=e198]:
                  - checkbox [ref=e199] [cursor=pointer]
                - columnheader "#" [ref=e200]
                - columnheader "Title / Prompt" [ref=e201]
                - columnheader "Tags" [ref=e202]
                - columnheader "Analysis Status" [ref=e203]
                - columnheader "Last Run" [ref=e204]
                - columnheader "Steps" [ref=e205]
                - columnheader "Created" [ref=e206]
                - columnheader "Actions" [ref=e207]
            - rowgroup [ref=e208]:
              - link "1 qa-src-1783511656205-bz5h Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 11:54 AM by ashid Clone test case Edit test case Delete test case" [ref=e209] [cursor=pointer]:
                - cell [ref=e210]:
                  - checkbox [ref=e211]
                - cell "1" [ref=e212]
                - cell "qa-src-1783511656205-bz5h Manual Source for clone" [ref=e213]:
                  - generic [ref=e214]:
                    - generic [ref=e215]:
                      - generic [ref=e216]: qa-src-1783511656205-bz5h
                      - generic [ref=e217]:
                        - img [ref=e218]
                        - text: Manual
                    - generic "Source for clone" [ref=e221]
                - cell "Add tags" [ref=e222]:
                  - button "Add tags" [ref=e223]:
                    - generic [ref=e224]:
                      - img [ref=e225]
                      - text: Add tags
                - cell "Idle" [ref=e228]:
                  - generic [ref=e229]: Idle
                - cell "No Runs" [ref=e231]:
                  - generic [ref=e234]: No Runs
                - cell "0" [ref=e235]
                - cell "Jul 8, 2026, 11:54 AM by ashid" [ref=e236]:
                  - generic [ref=e237]:
                    - generic [ref=e238]: Jul 8, 2026, 11:54 AM
                    - generic [ref=e239]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e240]:
                  - generic [ref=e241]:
                    - button "Clone test case" [ref=e242]:
                      - img [ref=e243]
                    - button "Edit test case" [ref=e246]:
                      - img [ref=e247]
                    - button "Delete test case" [ref=e250]:
                      - img [ref=e251]
              - link "2 qa-rec-1783511346318-so59 Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 11:49 AM by ashid Clone test case Edit test case Delete test case" [ref=e254] [cursor=pointer]:
                - cell [ref=e255]:
                  - checkbox [ref=e256]
                - cell "2" [ref=e257]
                - cell "qa-rec-1783511346318-so59 Recorded" [ref=e258]:
                  - generic [ref=e260]:
                    - generic [ref=e261]: qa-rec-1783511346318-so59
                    - generic [ref=e262]:
                      - img [ref=e263]
                      - text: Recorded
                - cell "Add tags" [ref=e266]:
                  - button "Add tags" [ref=e267]:
                    - generic [ref=e268]:
                      - img [ref=e269]
                      - text: Add tags
                - cell "Ready to Record" [ref=e272]:
                  - generic [ref=e273]: Ready to Record
                - cell "No Runs" [ref=e275]:
                  - generic [ref=e278]: No Runs
                - cell "1" [ref=e279]
                - cell "Jul 8, 2026, 11:49 AM by ashid" [ref=e280]:
                  - generic [ref=e281]:
                    - generic [ref=e282]: Jul 8, 2026, 11:49 AM
                    - generic [ref=e283]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e284]:
                  - generic [ref=e285]:
                    - button "Clone test case" [ref=e286]:
                      - img [ref=e287]
                    - button "Edit test case" [ref=e290]:
                      - img [ref=e291]
                    - button "Delete test case" [ref=e294]:
                      - img [ref=e295]
              - link "3 qa-src-1783510739169-p4yx Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 11:39 AM by ashid Clone test case Edit test case Delete test case" [ref=e298] [cursor=pointer]:
                - cell [ref=e299]:
                  - checkbox [ref=e300]
                - cell "3" [ref=e301]
                - cell "qa-src-1783510739169-p4yx Manual Source for clone" [ref=e302]:
                  - generic [ref=e303]:
                    - generic [ref=e304]:
                      - generic [ref=e305]: qa-src-1783510739169-p4yx
                      - generic [ref=e306]:
                        - img [ref=e307]
                        - text: Manual
                    - generic "Source for clone" [ref=e310]
                - cell "Add tags" [ref=e311]:
                  - button "Add tags" [ref=e312]:
                    - generic [ref=e313]:
                      - img [ref=e314]
                      - text: Add tags
                - cell "Idle" [ref=e317]:
                  - generic [ref=e318]: Idle
                - cell "No Runs" [ref=e320]:
                  - generic [ref=e323]: No Runs
                - cell "0" [ref=e324]
                - cell "Jul 8, 2026, 11:39 AM by ashid" [ref=e325]:
                  - generic [ref=e326]:
                    - generic [ref=e327]: Jul 8, 2026, 11:39 AM
                    - generic [ref=e328]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e329]:
                  - generic [ref=e330]:
                    - button "Clone test case" [ref=e331]:
                      - img [ref=e332]
                    - button "Edit test case" [ref=e335]:
                      - img [ref=e336]
                    - button "Delete test case" [ref=e339]:
                      - img [ref=e340]
              - link "4 qa-tc78-20260708113754 Manual Add tags Plan Ready No Runs 0 Jul 8, 2026, 11:38 AM by ashid Clone test case Edit test case Delete test case" [ref=e343] [cursor=pointer]:
                - cell [ref=e344]:
                  - checkbox [ref=e345]
                - cell "4" [ref=e346]
                - cell "qa-tc78-20260708113754 Manual" [ref=e347]:
                  - generic [ref=e349]:
                    - generic [ref=e350]: qa-tc78-20260708113754
                    - generic [ref=e351]:
                      - img [ref=e352]
                      - text: Manual
                - cell "Add tags" [ref=e355]:
                  - button "Add tags" [ref=e356]:
                    - generic [ref=e357]:
                      - img [ref=e358]
                      - text: Add tags
                - cell "Plan Ready" [ref=e361]:
                  - generic [ref=e362]: Plan Ready
                - cell "No Runs" [ref=e364]:
                  - generic [ref=e367]: No Runs
                - cell "0" [ref=e368]
                - cell "Jul 8, 2026, 11:38 AM by ashid" [ref=e369]:
                  - generic [ref=e370]:
                    - generic [ref=e371]: Jul 8, 2026, 11:38 AM
                    - generic [ref=e372]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e373]:
                  - generic [ref=e374]:
                    - button "Clone test case" [ref=e375]:
                      - img [ref=e376]
                    - button "Edit test case" [ref=e379]:
                      - img [ref=e380]
                    - button "Delete test case" [ref=e383]:
                      - img [ref=e384]
              - link "5 qa-tc77-20260708113642 Manual Add tags Completed No Runs 3 Jul 8, 2026, 11:36 AM by ashid Clone test case Edit test case Delete test case" [ref=e387] [cursor=pointer]:
                - cell [ref=e388]:
                  - checkbox [ref=e389]
                - cell "5" [ref=e390]
                - cell "qa-tc77-20260708113642 Manual" [ref=e391]:
                  - generic [ref=e393]:
                    - generic [ref=e394]: qa-tc77-20260708113642
                    - generic [ref=e395]:
                      - img [ref=e396]
                      - text: Manual
                - cell "Add tags" [ref=e399]:
                  - button "Add tags" [ref=e400]:
                    - generic [ref=e401]:
                      - img [ref=e402]
                      - text: Add tags
                - cell "Completed" [ref=e405]:
                  - generic [ref=e406]: Completed
                - cell "No Runs" [ref=e408]:
                  - generic [ref=e411]: No Runs
                - cell "3" [ref=e412]
                - cell "Jul 8, 2026, 11:36 AM by ashid" [ref=e413]:
                  - generic [ref=e414]:
                    - generic [ref=e415]: Jul 8, 2026, 11:36 AM
                    - generic [ref=e416]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e417]:
                  - generic [ref=e418]:
                    - button "Clone test case" [ref=e419]:
                      - img [ref=e420]
                    - button "Edit test case" [ref=e423]:
                      - img [ref=e424]
                    - button "Delete test case" [ref=e427]:
                      - img [ref=e428]
              - link "6 qa-tc78-20260708113621 Manual Add tags Plan Ready No Runs 0 Jul 8, 2026, 11:36 AM by ashid Clone test case Edit test case Delete test case" [ref=e431] [cursor=pointer]:
                - cell [ref=e432]:
                  - checkbox [ref=e433]
                - cell "6" [ref=e434]
                - cell "qa-tc78-20260708113621 Manual" [ref=e435]:
                  - generic [ref=e437]:
                    - generic [ref=e438]: qa-tc78-20260708113621
                    - generic [ref=e439]:
                      - img [ref=e440]
                      - text: Manual
                - cell "Add tags" [ref=e443]:
                  - button "Add tags" [ref=e444]:
                    - generic [ref=e445]:
                      - img [ref=e446]
                      - text: Add tags
                - cell "Plan Ready" [ref=e449]:
                  - generic [ref=e450]: Plan Ready
                - cell "No Runs" [ref=e452]:
                  - generic [ref=e455]: No Runs
                - cell "0" [ref=e456]
                - cell "Jul 8, 2026, 11:36 AM by ashid" [ref=e457]:
                  - generic [ref=e458]:
                    - generic [ref=e459]: Jul 8, 2026, 11:36 AM
                    - generic [ref=e460]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e461]:
                  - generic [ref=e462]:
                    - button "Clone test case" [ref=e463]:
                      - img [ref=e464]
                    - button "Edit test case" [ref=e467]:
                      - img [ref=e468]
                    - button "Delete test case" [ref=e471]:
                      - img [ref=e472]
              - link "7 qa-tc77-20260708113508 Manual Add tags Completed No Runs 5 Jul 8, 2026, 11:35 AM by ashid Clone test case Edit test case Delete test case" [ref=e475] [cursor=pointer]:
                - cell [ref=e476]:
                  - checkbox [ref=e477]
                - cell "7" [ref=e478]
                - cell "qa-tc77-20260708113508 Manual" [ref=e479]:
                  - generic [ref=e481]:
                    - generic [ref=e482]: qa-tc77-20260708113508
                    - generic [ref=e483]:
                      - img [ref=e484]
                      - text: Manual
                - cell "Add tags" [ref=e487]:
                  - button "Add tags" [ref=e488]:
                    - generic [ref=e489]:
                      - img [ref=e490]
                      - text: Add tags
                - cell "Completed" [ref=e493]:
                  - generic [ref=e494]: Completed
                - cell "No Runs" [ref=e496]:
                  - generic [ref=e499]: No Runs
                - cell "5" [ref=e500]
                - cell "Jul 8, 2026, 11:35 AM by ashid" [ref=e501]:
                  - generic [ref=e502]:
                    - generic [ref=e503]: Jul 8, 2026, 11:35 AM
                    - generic [ref=e504]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e505]:
                  - generic [ref=e506]:
                    - button "Clone test case" [ref=e507]:
                      - img [ref=e508]
                    - button "Edit test case" [ref=e511]:
                      - img [ref=e512]
                    - button "Delete test case" [ref=e515]:
                      - img [ref=e516]
              - link "8 qa-rec-1783504270404-qjdd Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 09:51 AM by ashid Clone test case Edit test case Delete test case" [ref=e519] [cursor=pointer]:
                - cell [ref=e520]:
                  - checkbox [ref=e521]
                - cell "8" [ref=e522]
                - cell "qa-rec-1783504270404-qjdd Recorded" [ref=e523]:
                  - generic [ref=e525]:
                    - generic [ref=e526]: qa-rec-1783504270404-qjdd
                    - generic [ref=e527]:
                      - img [ref=e528]
                      - text: Recorded
                - cell "Add tags" [ref=e531]:
                  - button "Add tags" [ref=e532]:
                    - generic [ref=e533]:
                      - img [ref=e534]
                      - text: Add tags
                - cell "Ready to Record" [ref=e537]:
                  - generic [ref=e538]: Ready to Record
                - cell "No Runs" [ref=e540]:
                  - generic [ref=e543]: No Runs
                - cell "1" [ref=e544]
                - cell "Jul 8, 2026, 09:51 AM by ashid" [ref=e545]:
                  - generic [ref=e546]:
                    - generic [ref=e547]: Jul 8, 2026, 09:51 AM
                    - generic [ref=e548]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e549]:
                  - generic [ref=e550]:
                    - button "Clone test case" [ref=e551]:
                      - img [ref=e552]
                    - button "Edit test case" [ref=e555]:
                      - img [ref=e556]
                    - button "Delete test case" [ref=e559]:
                      - img [ref=e560]
              - link "9 qa-ai-1783503315776-lo7x Manual Created by Playwright TC-065 Add tags Idle No Runs 0 Jul 8, 2026, 09:35 AM by ashid Clone test case Edit test case Delete test case" [ref=e563] [cursor=pointer]:
                - cell [ref=e564]:
                  - checkbox [ref=e565]
                - cell "9" [ref=e566]
                - cell "qa-ai-1783503315776-lo7x Manual Created by Playwright TC-065" [ref=e567]:
                  - generic [ref=e568]:
                    - generic [ref=e569]:
                      - generic [ref=e570]: qa-ai-1783503315776-lo7x
                      - generic [ref=e571]:
                        - img [ref=e572]
                        - text: Manual
                    - generic "Created by Playwright TC-065" [ref=e575]
                - cell "Add tags" [ref=e576]:
                  - button "Add tags" [ref=e577]:
                    - generic [ref=e578]:
                      - img [ref=e579]
                      - text: Add tags
                - cell "Idle" [ref=e582]:
                  - generic [ref=e583]: Idle
                - cell "No Runs" [ref=e585]:
                  - generic [ref=e588]: No Runs
                - cell "0" [ref=e589]
                - cell "Jul 8, 2026, 09:35 AM by ashid" [ref=e590]:
                  - generic [ref=e591]:
                    - generic [ref=e592]: Jul 8, 2026, 09:35 AM
                    - generic [ref=e593]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e594]:
                  - generic [ref=e595]:
                    - button "Clone test case" [ref=e596]:
                      - img [ref=e597]
                    - button "Edit test case" [ref=e600]:
                      - img [ref=e601]
                    - button "Delete test case" [ref=e604]:
                      - img [ref=e605]
              - link "10 qa-tc77-20260708093515 Manual Add tags Plan Ready No Runs 0 Jul 8, 2026, 09:35 AM by ashid Clone test case Edit test case Delete test case" [ref=e608] [cursor=pointer]:
                - cell [ref=e609]:
                  - checkbox [ref=e610]
                - cell "10" [ref=e611]
                - cell "qa-tc77-20260708093515 Manual" [ref=e612]:
                  - generic [ref=e614]:
                    - generic [ref=e615]: qa-tc77-20260708093515
                    - generic [ref=e616]:
                      - img [ref=e617]
                      - text: Manual
                - cell "Add tags" [ref=e620]:
                  - button "Add tags" [ref=e621]:
                    - generic [ref=e622]:
                      - img [ref=e623]
                      - text: Add tags
                - cell "Plan Ready" [ref=e626]:
                  - generic [ref=e627]: Plan Ready
                - cell "No Runs" [ref=e629]:
                  - generic [ref=e632]: No Runs
                - cell "0" [ref=e633]
                - cell "Jul 8, 2026, 09:35 AM by ashid" [ref=e634]:
                  - generic [ref=e635]:
                    - generic [ref=e636]: Jul 8, 2026, 09:35 AM
                    - generic [ref=e637]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e638]:
                  - generic [ref=e639]:
                    - button "Clone test case" [ref=e640]:
                      - img [ref=e641]
                    - button "Edit test case" [ref=e644]:
                      - img [ref=e645]
                    - button "Delete test case" [ref=e648]:
                      - img [ref=e649]
              - link "11 qa-rec-1783496845141-uxh6 Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:47 AM by ashid Clone test case Edit test case Delete test case" [ref=e652] [cursor=pointer]:
                - cell [ref=e653]:
                  - checkbox [ref=e654]
                - cell "11" [ref=e655]
                - cell "qa-rec-1783496845141-uxh6 Recorded" [ref=e656]:
                  - generic [ref=e658]:
                    - generic [ref=e659]: qa-rec-1783496845141-uxh6
                    - generic [ref=e660]:
                      - img [ref=e661]
                      - text: Recorded
                - cell "Add tags" [ref=e664]:
                  - button "Add tags" [ref=e665]:
                    - generic [ref=e666]:
                      - img [ref=e667]
                      - text: Add tags
                - cell "Ready to Record" [ref=e670]:
                  - generic [ref=e671]: Ready to Record
                - cell "No Runs" [ref=e673]:
                  - generic [ref=e676]: No Runs
                - cell "1" [ref=e677]
                - cell "Jul 8, 2026, 07:47 AM by ashid" [ref=e678]:
                  - generic [ref=e679]:
                    - generic [ref=e680]: Jul 8, 2026, 07:47 AM
                    - generic [ref=e681]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e682]:
                  - generic [ref=e683]:
                    - button "Clone test case" [ref=e684]:
                      - img [ref=e685]
                    - button "Edit test case" [ref=e688]:
                      - img [ref=e689]
                    - button "Delete test case" [ref=e692]:
                      - img [ref=e693]
              - link "12 qa-rec-1783496571346-zh7e Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:42 AM by ashid Clone test case Edit test case Delete test case" [ref=e696] [cursor=pointer]:
                - cell [ref=e697]:
                  - checkbox [ref=e698]
                - cell "12" [ref=e699]
                - cell "qa-rec-1783496571346-zh7e Recorded" [ref=e700]:
                  - generic [ref=e702]:
                    - generic [ref=e703]: qa-rec-1783496571346-zh7e
                    - generic [ref=e704]:
                      - img [ref=e705]
                      - text: Recorded
                - cell "Add tags" [ref=e708]:
                  - button "Add tags" [ref=e709]:
                    - generic [ref=e710]:
                      - img [ref=e711]
                      - text: Add tags
                - cell "Ready to Record" [ref=e714]:
                  - generic [ref=e715]: Ready to Record
                - cell "No Runs" [ref=e717]:
                  - generic [ref=e720]: No Runs
                - cell "1" [ref=e721]
                - cell "Jul 8, 2026, 07:42 AM by ashid" [ref=e722]:
                  - generic [ref=e723]:
                    - generic [ref=e724]: Jul 8, 2026, 07:42 AM
                    - generic [ref=e725]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e726]:
                  - generic [ref=e727]:
                    - button "Clone test case" [ref=e728]:
                      - img [ref=e729]
                    - button "Edit test case" [ref=e732]:
                      - img [ref=e733]
                    - button "Delete test case" [ref=e736]:
                      - img [ref=e737]
              - 'link "13 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:39 AM by ashid Clone test case Edit test case Delete test case" [ref=e740] [cursor=pointer]':
                - cell [ref=e741]:
                  - checkbox [ref=e742]
                - cell "13" [ref=e743]
                - 'cell "Record: xitester.com Recorded" [ref=e744]':
                  - generic [ref=e746]:
                    - generic [ref=e747]: "Record: xitester.com"
                    - generic [ref=e748]:
                      - img [ref=e749]
                      - text: Recorded
                - cell "Add tags" [ref=e752]:
                  - button "Add tags" [ref=e753]:
                    - generic [ref=e754]:
                      - img [ref=e755]
                      - text: Add tags
                - cell "Ready to Record" [ref=e758]:
                  - generic [ref=e759]: Ready to Record
                - cell "No Runs" [ref=e761]:
                  - generic [ref=e764]: No Runs
                - cell "1" [ref=e765]
                - cell "Jul 8, 2026, 07:39 AM by ashid" [ref=e766]:
                  - generic [ref=e767]:
                    - generic [ref=e768]: Jul 8, 2026, 07:39 AM
                    - generic [ref=e769]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e770]:
                  - generic [ref=e771]:
                    - button "Clone test case" [ref=e772]:
                      - img [ref=e773]
                    - button "Edit test case" [ref=e776]:
                      - img [ref=e777]
                    - button "Delete test case" [ref=e780]:
                      - img [ref=e781]
              - link "14 qa-rec-1783496102283-phu4 Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:36 AM by ashid Clone test case Edit test case Delete test case" [ref=e784] [cursor=pointer]:
                - cell [ref=e785]:
                  - checkbox [ref=e786]
                - cell "14" [ref=e787]
                - cell "qa-rec-1783496102283-phu4 Recorded" [ref=e788]:
                  - generic [ref=e790]:
                    - generic [ref=e791]: qa-rec-1783496102283-phu4
                    - generic [ref=e792]:
                      - img [ref=e793]
                      - text: Recorded
                - cell "Add tags" [ref=e796]:
                  - button "Add tags" [ref=e797]:
                    - generic [ref=e798]:
                      - img [ref=e799]
                      - text: Add tags
                - cell "Ready to Record" [ref=e802]:
                  - generic [ref=e803]: Ready to Record
                - cell "No Runs" [ref=e805]:
                  - generic [ref=e808]: No Runs
                - cell "1" [ref=e809]
                - cell "Jul 8, 2026, 07:36 AM by ashid" [ref=e810]:
                  - generic [ref=e811]:
                    - generic [ref=e812]: Jul 8, 2026, 07:36 AM
                    - generic [ref=e813]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e814]:
                  - generic [ref=e815]:
                    - button "Clone test case" [ref=e816]:
                      - img [ref=e817]
                    - button "Edit test case" [ref=e820]:
                      - img [ref=e821]
                    - button "Delete test case" [ref=e824]:
                      - img [ref=e825]
              - link "15 qa-rec-1783496071663-jl0q Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 07:34 AM by ashid Clone test case Edit test case Delete test case" [ref=e828] [cursor=pointer]:
                - cell [ref=e829]:
                  - checkbox [ref=e830]
                - cell "15" [ref=e831]
                - cell "qa-rec-1783496071663-jl0q Recorded" [ref=e832]:
                  - generic [ref=e834]:
                    - generic [ref=e835]: qa-rec-1783496071663-jl0q
                    - generic [ref=e836]:
                      - img [ref=e837]
                      - text: Recorded
                - cell "Add tags" [ref=e840]:
                  - button "Add tags" [ref=e841]:
                    - generic [ref=e842]:
                      - img [ref=e843]
                      - text: Add tags
                - cell "Ready to Record" [ref=e846]:
                  - generic [ref=e847]: Ready to Record
                - cell "No Runs" [ref=e849]:
                  - generic [ref=e852]: No Runs
                - cell "1" [ref=e853]
                - cell "Jul 8, 2026, 07:34 AM by ashid" [ref=e854]:
                  - generic [ref=e855]:
                    - generic [ref=e856]: Jul 8, 2026, 07:34 AM
                    - generic [ref=e857]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e858]:
                  - generic [ref=e859]:
                    - button "Clone test case" [ref=e860]:
                      - img [ref=e861]
                    - button "Edit test case" [ref=e864]:
                      - img [ref=e865]
                    - button "Delete test case" [ref=e868]:
                      - img [ref=e869]
              - link "16 qa-rec-1783495971747-bhwd Recording Add tags Recording No Runs 1 Jul 8, 2026, 07:32 AM by ashid Clone test case Edit test case Delete test case" [ref=e872] [cursor=pointer]:
                - cell [ref=e873]:
                  - checkbox [ref=e874]
                - cell "16" [ref=e875]
                - cell "qa-rec-1783495971747-bhwd Recording" [ref=e876]:
                  - generic [ref=e878]:
                    - generic [ref=e879]: qa-rec-1783495971747-bhwd
                    - generic [ref=e880]:
                      - img [ref=e881]
                      - text: Recording
                - cell "Add tags" [ref=e884]:
                  - button "Add tags" [ref=e885]:
                    - generic [ref=e886]:
                      - img [ref=e887]
                      - text: Add tags
                - cell "Recording" [ref=e890]:
                  - generic [ref=e891]: Recording
                - cell "No Runs" [ref=e893]:
                  - generic [ref=e896]: No Runs
                - cell "1" [ref=e897]
                - cell "Jul 8, 2026, 07:32 AM by ashid" [ref=e898]:
                  - generic [ref=e899]:
                    - generic [ref=e900]: Jul 8, 2026, 07:32 AM
                    - generic [ref=e901]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e902]:
                  - generic [ref=e903]:
                    - button "Clone test case" [ref=e904]:
                      - img [ref=e905]
                    - button "Edit test case" [ref=e908]:
                      - img [ref=e909]
                    - button "Delete test case" [ref=e912]:
                      - img [ref=e913]
              - link "17 qa-bulk-C-1783495575093-mv9j Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:26 AM by ashid Clone test case Edit test case Delete test case" [ref=e916] [cursor=pointer]:
                - cell [ref=e917]:
                  - checkbox [ref=e918]
                - cell "17" [ref=e919]
                - cell "qa-bulk-C-1783495575093-mv9j Manual" [ref=e920]:
                  - generic [ref=e922]:
                    - generic [ref=e923]: qa-bulk-C-1783495575093-mv9j
                    - generic [ref=e924]:
                      - img [ref=e925]
                      - text: Manual
                - cell "Add tags" [ref=e928]:
                  - button "Add tags" [ref=e929]:
                    - generic [ref=e930]:
                      - img [ref=e931]
                      - text: Add tags
                - cell "Idle" [ref=e934]:
                  - generic [ref=e935]: Idle
                - cell "No Runs" [ref=e937]:
                  - generic [ref=e940]: No Runs
                - cell "0" [ref=e941]
                - cell "Jul 8, 2026, 07:26 AM by ashid" [ref=e942]:
                  - generic [ref=e943]:
                    - generic [ref=e944]: Jul 8, 2026, 07:26 AM
                    - generic [ref=e945]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e946]:
                  - generic [ref=e947]:
                    - button "Clone test case" [ref=e948]:
                      - img [ref=e949]
                    - button "Edit test case" [ref=e952]:
                      - img [ref=e953]
                    - button "Delete test case" [ref=e956]:
                      - img [ref=e957]
              - link "18 qa-bulk-B-1783495575093-vu60 Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:26 AM by ashid Clone test case Edit test case Delete test case" [ref=e960] [cursor=pointer]:
                - cell [ref=e961]:
                  - checkbox [ref=e962]
                - cell "18" [ref=e963]
                - cell "qa-bulk-B-1783495575093-vu60 Manual" [ref=e964]:
                  - generic [ref=e966]:
                    - generic [ref=e967]: qa-bulk-B-1783495575093-vu60
                    - generic [ref=e968]:
                      - img [ref=e969]
                      - text: Manual
                - cell "Add tags" [ref=e972]:
                  - button "Add tags" [ref=e973]:
                    - generic [ref=e974]:
                      - img [ref=e975]
                      - text: Add tags
                - cell "Idle" [ref=e978]:
                  - generic [ref=e979]: Idle
                - cell "No Runs" [ref=e981]:
                  - generic [ref=e984]: No Runs
                - cell "0" [ref=e985]
                - cell "Jul 8, 2026, 07:26 AM by ashid" [ref=e986]:
                  - generic [ref=e987]:
                    - generic [ref=e988]: Jul 8, 2026, 07:26 AM
                    - generic [ref=e989]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e990]:
                  - generic [ref=e991]:
                    - button "Clone test case" [ref=e992]:
                      - img [ref=e993]
                    - button "Edit test case" [ref=e996]:
                      - img [ref=e997]
                    - button "Delete test case" [ref=e1000]:
                      - img [ref=e1001]
              - link "19 qa-bulk-A-1783495575093-h472 Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:26 AM by ashid Clone test case Edit test case Delete test case" [ref=e1004] [cursor=pointer]:
                - cell [ref=e1005]:
                  - checkbox [ref=e1006]
                - cell "19" [ref=e1007]
                - cell "qa-bulk-A-1783495575093-h472 Manual" [ref=e1008]:
                  - generic [ref=e1010]:
                    - generic [ref=e1011]: qa-bulk-A-1783495575093-h472
                    - generic [ref=e1012]:
                      - img [ref=e1013]
                      - text: Manual
                - cell "Add tags" [ref=e1016]:
                  - button "Add tags" [ref=e1017]:
                    - generic [ref=e1018]:
                      - img [ref=e1019]
                      - text: Add tags
                - cell "Idle" [ref=e1022]:
                  - generic [ref=e1023]: Idle
                - cell "No Runs" [ref=e1025]:
                  - generic [ref=e1028]: No Runs
                - cell "0" [ref=e1029]
                - cell "Jul 8, 2026, 07:26 AM by ashid" [ref=e1030]:
                  - generic [ref=e1031]:
                    - generic [ref=e1032]: Jul 8, 2026, 07:26 AM
                    - generic [ref=e1033]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e1034]:
                  - generic [ref=e1035]:
                    - button "Clone test case" [ref=e1036]:
                      - img [ref=e1037]
                    - button "Edit test case" [ref=e1040]:
                      - img [ref=e1041]
                    - button "Delete test case" [ref=e1044]:
                      - img [ref=e1045]
              - link "20 qa-bulk-C-1783494884314-rdc9 Manual Add tags Idle No Runs 0 Jul 8, 2026, 07:14 AM by ashid Clone test case Edit test case Delete test case" [ref=e1048] [cursor=pointer]:
                - cell [ref=e1049]:
                  - checkbox [ref=e1050]
                - cell "20" [ref=e1051]
                - cell "qa-bulk-C-1783494884314-rdc9 Manual" [ref=e1052]:
                  - generic [ref=e1054]:
                    - generic [ref=e1055]: qa-bulk-C-1783494884314-rdc9
                    - generic [ref=e1056]:
                      - img [ref=e1057]
                      - text: Manual
                - cell "Add tags" [ref=e1060]:
                  - button "Add tags" [ref=e1061]:
                    - generic [ref=e1062]:
                      - img [ref=e1063]
                      - text: Add tags
                - cell "Idle" [ref=e1066]:
                  - generic [ref=e1067]: Idle
                - cell "No Runs" [ref=e1069]:
                  - generic [ref=e1072]: No Runs
                - cell "0" [ref=e1073]
                - cell "Jul 8, 2026, 07:14 AM by ashid" [ref=e1074]:
                  - generic [ref=e1075]:
                    - generic [ref=e1076]: Jul 8, 2026, 07:14 AM
                    - generic [ref=e1077]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e1078]:
                  - generic [ref=e1079]:
                    - button "Clone test case" [ref=e1080]:
                      - img [ref=e1081]
                    - button "Edit test case" [ref=e1084]:
                      - img [ref=e1085]
                    - button "Delete test case" [ref=e1088]:
                      - img [ref=e1089]
          - generic [ref=e1094]:
            - generic [ref=e1095]: 1–20 of 407 test cases
            - generic [ref=e1096]:
              - generic [ref=e1097]:
                - generic [ref=e1098]: Rows per page
                - combobox [ref=e1099] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e1100]
              - generic [ref=e1102]:
                - generic [ref=e1103]: Page 1of21
                - generic [ref=e1104]:
                  - button "First page" [disabled]:
                    - img
                  - button "Previous page" [disabled]:
                    - img
                  - button "Next page" [ref=e1105] [cursor=pointer]:
                    - img [ref=e1106]
                  - button "Last page" [ref=e1108] [cursor=pointer]:
                    - img [ref=e1109]
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