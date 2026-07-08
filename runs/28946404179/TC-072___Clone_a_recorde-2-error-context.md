# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-072 — Clone a recorded test case
- Location: tests/test-cases.spec.ts:420:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: locator('table tbody tr.test-case-row').filter({ has: getByText('qa-rec-1783517563272-q94o', { exact: true }) }).filter({ has: getByText(/^Recorded$/) }).first()
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('table tbody tr.test-case-row').filter({ has: getByText('qa-rec-1783517563272-q94o', { exact: true }) }).filter({ has: getByText(/^Recorded$/) }).first()

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
          - generic [ref=e51]: v1.2.0
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
              - textbox "Search test cases…" [ref=e160]
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
              - 'link "1 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 01:33 PM by ashid Clone test case Edit test case Delete test case" [ref=e198] [cursor=pointer]':
                - cell [ref=e199]:
                  - checkbox [ref=e200]
                - cell "1" [ref=e201]
                - 'cell "Record: xitester.com Recorded" [ref=e202]':
                  - generic [ref=e204]:
                    - generic [ref=e205]: "Record: xitester.com"
                    - generic [ref=e206]:
                      - img [ref=e207]
                      - text: Recorded
                - cell "Add tags" [ref=e210]:
                  - button "Add tags" [ref=e211]:
                    - generic [ref=e212]:
                      - img [ref=e213]
                      - text: Add tags
                - cell "Ready to Record" [ref=e216]:
                  - generic [ref=e217]: Ready to Record
                - cell "No Runs" [ref=e219]:
                  - generic [ref=e222]: No Runs
                - cell "1" [ref=e223]
                - cell "Jul 8, 2026, 01:33 PM by ashid" [ref=e224]:
                  - generic [ref=e225]:
                    - generic [ref=e226]: Jul 8, 2026, 01:33 PM
                    - generic [ref=e227]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e228]:
                  - generic [ref=e229]:
                    - button "Clone test case" [ref=e230]:
                      - img [ref=e231]
                    - button "Edit test case" [ref=e234]:
                      - img [ref=e235]
                    - button "Delete test case" [ref=e238]:
                      - img [ref=e239]
              - 'link "2 Record: xitester.com Recording Add tags Recording No Runs 1 Jul 8, 2026, 01:31 PM by ashid Clone test case Edit test case Delete test case" [ref=e242] [cursor=pointer]':
                - cell [ref=e243]:
                  - checkbox [ref=e244]
                - cell "2" [ref=e245]
                - 'cell "Record: xitester.com Recording" [ref=e246]':
                  - generic [ref=e248]:
                    - generic [ref=e249]: "Record: xitester.com"
                    - generic [ref=e250]:
                      - img [ref=e251]
                      - text: Recording
                - cell "Add tags" [ref=e254]:
                  - button "Add tags" [ref=e255]:
                    - generic [ref=e256]:
                      - img [ref=e257]
                      - text: Add tags
                - cell "Recording" [ref=e260]:
                  - generic [ref=e261]: Recording
                - cell "No Runs" [ref=e263]:
                  - generic [ref=e266]: No Runs
                - cell "1" [ref=e267]
                - cell "Jul 8, 2026, 01:31 PM by ashid" [ref=e268]:
                  - generic [ref=e269]:
                    - generic [ref=e270]: Jul 8, 2026, 01:31 PM
                    - generic [ref=e271]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e272]:
                  - generic [ref=e273]:
                    - button "Clone test case" [ref=e274]:
                      - img [ref=e275]
                    - button "Edit test case" [ref=e278]:
                      - img [ref=e279]
                    - button "Delete test case" [ref=e282]:
                      - img [ref=e283]
              - 'link "3 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 01:16 PM by ashid Clone test case Edit test case Delete test case" [ref=e286] [cursor=pointer]':
                - cell [ref=e287]:
                  - checkbox [ref=e288]
                - cell "3" [ref=e289]
                - 'cell "Record: xitester.com Recorded" [ref=e290]':
                  - generic [ref=e292]:
                    - generic [ref=e293]: "Record: xitester.com"
                    - generic [ref=e294]:
                      - img [ref=e295]
                      - text: Recorded
                - cell "Add tags" [ref=e298]:
                  - button "Add tags" [ref=e299]:
                    - generic [ref=e300]:
                      - img [ref=e301]
                      - text: Add tags
                - cell "Ready to Record" [ref=e304]:
                  - generic [ref=e305]: Ready to Record
                - cell "No Runs" [ref=e307]:
                  - generic [ref=e310]: No Runs
                - cell "1" [ref=e311]
                - cell "Jul 8, 2026, 01:16 PM by ashid" [ref=e312]:
                  - generic [ref=e313]:
                    - generic [ref=e314]: Jul 8, 2026, 01:16 PM
                    - generic [ref=e315]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e316]:
                  - generic [ref=e317]:
                    - button "Clone test case" [ref=e318]:
                      - img [ref=e319]
                    - button "Edit test case" [ref=e322]:
                      - img [ref=e323]
                    - button "Delete test case" [ref=e326]:
                      - img [ref=e327]
              - 'link "4 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 01:14 PM by ashid Clone test case Edit test case Delete test case" [ref=e330] [cursor=pointer]':
                - cell [ref=e331]:
                  - checkbox [ref=e332]
                - cell "4" [ref=e333]
                - 'cell "Record: xitester.com Recorded" [ref=e334]':
                  - generic [ref=e336]:
                    - generic [ref=e337]: "Record: xitester.com"
                    - generic [ref=e338]:
                      - img [ref=e339]
                      - text: Recorded
                - cell "Add tags" [ref=e342]:
                  - button "Add tags" [ref=e343]:
                    - generic [ref=e344]:
                      - img [ref=e345]
                      - text: Add tags
                - cell "Ready to Record" [ref=e348]:
                  - generic [ref=e349]: Ready to Record
                - cell "No Runs" [ref=e351]:
                  - generic [ref=e354]: No Runs
                - cell "1" [ref=e355]
                - cell "Jul 8, 2026, 01:14 PM by ashid" [ref=e356]:
                  - generic [ref=e357]:
                    - generic [ref=e358]: Jul 8, 2026, 01:14 PM
                    - generic [ref=e359]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e360]:
                  - generic [ref=e361]:
                    - button "Clone test case" [ref=e362]:
                      - img [ref=e363]
                    - button "Edit test case" [ref=e366]:
                      - img [ref=e367]
                    - button "Delete test case" [ref=e370]:
                      - img [ref=e371]
              - 'link "5 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 01:03 PM by ashid Clone test case Edit test case Delete test case" [ref=e374] [cursor=pointer]':
                - cell [ref=e375]:
                  - checkbox [ref=e376]
                - cell "5" [ref=e377]
                - 'cell "Record: xitester.com Recorded" [ref=e378]':
                  - generic [ref=e380]:
                    - generic [ref=e381]: "Record: xitester.com"
                    - generic [ref=e382]:
                      - img [ref=e383]
                      - text: Recorded
                - cell "Add tags" [ref=e386]:
                  - button "Add tags" [ref=e387]:
                    - generic [ref=e388]:
                      - img [ref=e389]
                      - text: Add tags
                - cell "Ready to Record" [ref=e392]:
                  - generic [ref=e393]: Ready to Record
                - cell "No Runs" [ref=e395]:
                  - generic [ref=e398]: No Runs
                - cell "1" [ref=e399]
                - cell "Jul 8, 2026, 01:03 PM by ashid" [ref=e400]:
                  - generic [ref=e401]:
                    - generic [ref=e402]: Jul 8, 2026, 01:03 PM
                    - generic [ref=e403]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e404]:
                  - generic [ref=e405]:
                    - button "Clone test case" [ref=e406]:
                      - img [ref=e407]
                    - button "Edit test case" [ref=e410]:
                      - img [ref=e411]
                    - button "Delete test case" [ref=e414]:
                      - img [ref=e415]
              - 'link "6 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 01:02 PM by ashid Clone test case Edit test case Delete test case" [ref=e418] [cursor=pointer]':
                - cell [ref=e419]:
                  - checkbox [ref=e420]
                - cell "6" [ref=e421]
                - 'cell "Record: xitester.com Recorded" [ref=e422]':
                  - generic [ref=e424]:
                    - generic [ref=e425]: "Record: xitester.com"
                    - generic [ref=e426]:
                      - img [ref=e427]
                      - text: Recorded
                - cell "Add tags" [ref=e430]:
                  - button "Add tags" [ref=e431]:
                    - generic [ref=e432]:
                      - img [ref=e433]
                      - text: Add tags
                - cell "Ready to Record" [ref=e436]:
                  - generic [ref=e437]: Ready to Record
                - cell "No Runs" [ref=e439]:
                  - generic [ref=e442]: No Runs
                - cell "1" [ref=e443]
                - cell "Jul 8, 2026, 01:02 PM by ashid" [ref=e444]:
                  - generic [ref=e445]:
                    - generic [ref=e446]: Jul 8, 2026, 01:02 PM
                    - generic [ref=e447]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e448]:
                  - generic [ref=e449]:
                    - button "Clone test case" [ref=e450]:
                      - img [ref=e451]
                    - button "Edit test case" [ref=e454]:
                      - img [ref=e455]
                    - button "Delete test case" [ref=e458]:
                      - img [ref=e459]
              - 'link "7 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 12:54 PM by ashid Clone test case Edit test case Delete test case" [ref=e462] [cursor=pointer]':
                - cell [ref=e463]:
                  - checkbox [ref=e464]
                - cell "7" [ref=e465]
                - 'cell "Record: xitester.com Recorded" [ref=e466]':
                  - generic [ref=e468]:
                    - generic [ref=e469]: "Record: xitester.com"
                    - generic [ref=e470]:
                      - img [ref=e471]
                      - text: Recorded
                - cell "Add tags" [ref=e474]:
                  - button "Add tags" [ref=e475]:
                    - generic [ref=e476]:
                      - img [ref=e477]
                      - text: Add tags
                - cell "Ready to Record" [ref=e480]:
                  - generic [ref=e481]: Ready to Record
                - cell "No Runs" [ref=e483]:
                  - generic [ref=e486]: No Runs
                - cell "1" [ref=e487]
                - cell "Jul 8, 2026, 12:54 PM by ashid" [ref=e488]:
                  - generic [ref=e489]:
                    - generic [ref=e490]: Jul 8, 2026, 12:54 PM
                    - generic [ref=e491]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e492]:
                  - generic [ref=e493]:
                    - button "Clone test case" [ref=e494]:
                      - img [ref=e495]
                    - button "Edit test case" [ref=e498]:
                      - img [ref=e499]
                    - button "Delete test case" [ref=e502]:
                      - img [ref=e503]
              - 'link "8 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 12:53 PM by ashid Clone test case Edit test case Delete test case" [ref=e506] [cursor=pointer]':
                - cell [ref=e507]:
                  - checkbox [ref=e508]
                - cell "8" [ref=e509]
                - 'cell "Record: xitester.com Recorded" [ref=e510]':
                  - generic [ref=e512]:
                    - generic [ref=e513]: "Record: xitester.com"
                    - generic [ref=e514]:
                      - img [ref=e515]
                      - text: Recorded
                - cell "Add tags" [ref=e518]:
                  - button "Add tags" [ref=e519]:
                    - generic [ref=e520]:
                      - img [ref=e521]
                      - text: Add tags
                - cell "Ready to Record" [ref=e524]:
                  - generic [ref=e525]: Ready to Record
                - cell "No Runs" [ref=e527]:
                  - generic [ref=e530]: No Runs
                - cell "1" [ref=e531]
                - cell "Jul 8, 2026, 12:53 PM by ashid" [ref=e532]:
                  - generic [ref=e533]:
                    - generic [ref=e534]: Jul 8, 2026, 12:53 PM
                    - generic [ref=e535]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e536]:
                  - generic [ref=e537]:
                    - button "Clone test case" [ref=e538]:
                      - img [ref=e539]
                    - button "Edit test case" [ref=e542]:
                      - img [ref=e543]
                    - button "Delete test case" [ref=e546]:
                      - img [ref=e547]
              - 'link "9 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 12:50 PM by ashid Clone test case Edit test case Delete test case" [ref=e550] [cursor=pointer]':
                - cell [ref=e551]:
                  - checkbox [ref=e552]
                - cell "9" [ref=e553]
                - 'cell "Record: xitester.com Recorded" [ref=e554]':
                  - generic [ref=e556]:
                    - generic [ref=e557]: "Record: xitester.com"
                    - generic [ref=e558]:
                      - img [ref=e559]
                      - text: Recorded
                - cell "Add tags" [ref=e562]:
                  - button "Add tags" [ref=e563]:
                    - generic [ref=e564]:
                      - img [ref=e565]
                      - text: Add tags
                - cell "Ready to Record" [ref=e568]:
                  - generic [ref=e569]: Ready to Record
                - cell "No Runs" [ref=e571]:
                  - generic [ref=e574]: No Runs
                - cell "1" [ref=e575]
                - cell "Jul 8, 2026, 12:50 PM by ashid" [ref=e576]:
                  - generic [ref=e577]:
                    - generic [ref=e578]: Jul 8, 2026, 12:50 PM
                    - generic [ref=e579]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e580]:
                  - generic [ref=e581]:
                    - button "Clone test case" [ref=e582]:
                      - img [ref=e583]
                    - button "Edit test case" [ref=e586]:
                      - img [ref=e587]
                    - button "Delete test case" [ref=e590]:
                      - img [ref=e591]
              - 'link "10 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 12:48 PM by ashid Clone test case Edit test case Delete test case" [ref=e594] [cursor=pointer]':
                - cell [ref=e595]:
                  - checkbox [ref=e596]
                - cell "10" [ref=e597]
                - 'cell "Record: xitester.com Recorded" [ref=e598]':
                  - generic [ref=e600]:
                    - generic [ref=e601]: "Record: xitester.com"
                    - generic [ref=e602]:
                      - img [ref=e603]
                      - text: Recorded
                - cell "Add tags" [ref=e606]:
                  - button "Add tags" [ref=e607]:
                    - generic [ref=e608]:
                      - img [ref=e609]
                      - text: Add tags
                - cell "Ready to Record" [ref=e612]:
                  - generic [ref=e613]: Ready to Record
                - cell "No Runs" [ref=e615]:
                  - generic [ref=e618]: No Runs
                - cell "1" [ref=e619]
                - cell "Jul 8, 2026, 12:48 PM by ashid" [ref=e620]:
                  - generic [ref=e621]:
                    - generic [ref=e622]: Jul 8, 2026, 12:48 PM
                    - generic [ref=e623]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e624]:
                  - generic [ref=e625]:
                    - button "Clone test case" [ref=e626]:
                      - img [ref=e627]
                    - button "Edit test case" [ref=e630]:
                      - img [ref=e631]
                    - button "Delete test case" [ref=e634]:
                      - img [ref=e635]
              - link "11 record test2 Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 12:40 PM by ashid Clone test case Edit test case Delete test case" [ref=e638] [cursor=pointer]:
                - cell [ref=e639]:
                  - checkbox [ref=e640]
                - cell "11" [ref=e641]
                - cell "record test2 Recorded" [ref=e642]:
                  - generic [ref=e644]:
                    - generic [ref=e645]: record test2
                    - generic [ref=e646]:
                      - img [ref=e647]
                      - text: Recorded
                - cell "Add tags" [ref=e650]:
                  - button "Add tags" [ref=e651]:
                    - generic [ref=e652]:
                      - img [ref=e653]
                      - text: Add tags
                - cell "Ready to Record" [ref=e656]:
                  - generic [ref=e657]: Ready to Record
                - cell "No Runs" [ref=e659]:
                  - generic [ref=e662]: No Runs
                - cell "1" [ref=e663]
                - cell "Jul 8, 2026, 12:40 PM by ashid" [ref=e664]:
                  - generic [ref=e665]:
                    - generic [ref=e666]: Jul 8, 2026, 12:40 PM
                    - generic [ref=e667]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e668]:
                  - generic [ref=e669]:
                    - button "Clone test case" [ref=e670]:
                      - img [ref=e671]
                    - button "Edit test case" [ref=e674]:
                      - img [ref=e675]
                    - button "Delete test case" [ref=e678]:
                      - img [ref=e679]
              - link "12 fdgdf Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 12:39 PM by ashid Clone test case Edit test case Delete test case" [ref=e682] [cursor=pointer]:
                - cell [ref=e683]:
                  - checkbox [ref=e684]
                - cell "12" [ref=e685]
                - cell "fdgdf Recorded" [ref=e686]:
                  - generic [ref=e688]:
                    - generic [ref=e689]: fdgdf
                    - generic [ref=e690]:
                      - img [ref=e691]
                      - text: Recorded
                - cell "Add tags" [ref=e694]:
                  - button "Add tags" [ref=e695]:
                    - generic [ref=e696]:
                      - img [ref=e697]
                      - text: Add tags
                - cell "Ready to Record" [ref=e700]:
                  - generic [ref=e701]: Ready to Record
                - cell "No Runs" [ref=e703]:
                  - generic [ref=e706]: No Runs
                - cell "1" [ref=e707]
                - cell "Jul 8, 2026, 12:39 PM by ashid" [ref=e708]:
                  - generic [ref=e709]:
                    - generic [ref=e710]: Jul 8, 2026, 12:39 PM
                    - generic [ref=e711]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e712]:
                  - generic [ref=e713]:
                    - button "Clone test case" [ref=e714]:
                      - img [ref=e715]
                    - button "Edit test case" [ref=e718]:
                      - img [ref=e719]
                    - button "Delete test case" [ref=e722]:
                      - img [ref=e723]
              - 'link "13 Record: xitester.com Recording Add tags Recording No Runs 1 Jul 8, 2026, 12:38 PM by ashid Clone test case Edit test case Delete test case" [ref=e726] [cursor=pointer]':
                - cell [ref=e727]:
                  - checkbox [ref=e728]
                - cell "13" [ref=e729]
                - 'cell "Record: xitester.com Recording" [ref=e730]':
                  - generic [ref=e732]:
                    - generic [ref=e733]: "Record: xitester.com"
                    - generic [ref=e734]:
                      - img [ref=e735]
                      - text: Recording
                - cell "Add tags" [ref=e738]:
                  - button "Add tags" [ref=e739]:
                    - generic [ref=e740]:
                      - img [ref=e741]
                      - text: Add tags
                - cell "Recording" [ref=e744]:
                  - generic [ref=e745]: Recording
                - cell "No Runs" [ref=e747]:
                  - generic [ref=e750]: No Runs
                - cell "1" [ref=e751]
                - cell "Jul 8, 2026, 12:38 PM by ashid" [ref=e752]:
                  - generic [ref=e753]:
                    - generic [ref=e754]: Jul 8, 2026, 12:38 PM
                    - generic [ref=e755]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e756]:
                  - generic [ref=e757]:
                    - button "Clone test case" [ref=e758]:
                      - img [ref=e759]
                    - button "Edit test case" [ref=e762]:
                      - img [ref=e763]
                    - button "Delete test case" [ref=e766]:
                      - img [ref=e767]
              - 'link "14 Record: xitester.com Recording Add tags Recording No Runs 1 Jul 8, 2026, 12:38 PM by ashid Clone test case Edit test case Delete test case" [ref=e770] [cursor=pointer]':
                - cell [ref=e771]:
                  - checkbox [ref=e772]
                - cell "14" [ref=e773]
                - 'cell "Record: xitester.com Recording" [ref=e774]':
                  - generic [ref=e776]:
                    - generic [ref=e777]: "Record: xitester.com"
                    - generic [ref=e778]:
                      - img [ref=e779]
                      - text: Recording
                - cell "Add tags" [ref=e782]:
                  - button "Add tags" [ref=e783]:
                    - generic [ref=e784]:
                      - img [ref=e785]
                      - text: Add tags
                - cell "Recording" [ref=e788]:
                  - generic [ref=e789]: Recording
                - cell "No Runs" [ref=e791]:
                  - generic [ref=e794]: No Runs
                - cell "1" [ref=e795]
                - cell "Jul 8, 2026, 12:38 PM by ashid" [ref=e796]:
                  - generic [ref=e797]:
                    - generic [ref=e798]: Jul 8, 2026, 12:38 PM
                    - generic [ref=e799]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e800]:
                  - generic [ref=e801]:
                    - button "Clone test case" [ref=e802]:
                      - img [ref=e803]
                    - button "Edit test case" [ref=e806]:
                      - img [ref=e807]
                    - button "Delete test case" [ref=e810]:
                      - img [ref=e811]
              - 'link "15 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 12:37 PM by ashid Clone test case Edit test case Delete test case" [ref=e814] [cursor=pointer]':
                - cell [ref=e815]:
                  - checkbox [ref=e816]
                - cell "15" [ref=e817]
                - 'cell "Record: xitester.com Recorded" [ref=e818]':
                  - generic [ref=e820]:
                    - generic [ref=e821]: "Record: xitester.com"
                    - generic [ref=e822]:
                      - img [ref=e823]
                      - text: Recorded
                - cell "Add tags" [ref=e826]:
                  - button "Add tags" [ref=e827]:
                    - generic [ref=e828]:
                      - img [ref=e829]
                      - text: Add tags
                - cell "Ready to Record" [ref=e832]:
                  - generic [ref=e833]: Ready to Record
                - cell "No Runs" [ref=e835]:
                  - generic [ref=e838]: No Runs
                - cell "1" [ref=e839]
                - cell "Jul 8, 2026, 12:37 PM by ashid" [ref=e840]:
                  - generic [ref=e841]:
                    - generic [ref=e842]: Jul 8, 2026, 12:37 PM
                    - generic [ref=e843]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e844]:
                  - generic [ref=e845]:
                    - button "Clone test case" [ref=e846]:
                      - img [ref=e847]
                    - button "Edit test case" [ref=e850]:
                      - img [ref=e851]
                    - button "Delete test case" [ref=e854]:
                      - img [ref=e855]
              - 'link "16 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 12:30 PM by ashid Clone test case Edit test case Delete test case" [ref=e858] [cursor=pointer]':
                - cell [ref=e859]:
                  - checkbox [ref=e860]
                - cell "16" [ref=e861]
                - 'cell "Record: xitester.com Recorded" [ref=e862]':
                  - generic [ref=e864]:
                    - generic [ref=e865]: "Record: xitester.com"
                    - generic [ref=e866]:
                      - img [ref=e867]
                      - text: Recorded
                - cell "Add tags" [ref=e870]:
                  - button "Add tags" [ref=e871]:
                    - generic [ref=e872]:
                      - img [ref=e873]
                      - text: Add tags
                - cell "Ready to Record" [ref=e876]:
                  - generic [ref=e877]: Ready to Record
                - cell "No Runs" [ref=e879]:
                  - generic [ref=e882]: No Runs
                - cell "1" [ref=e883]
                - cell "Jul 8, 2026, 12:30 PM by ashid" [ref=e884]:
                  - generic [ref=e885]:
                    - generic [ref=e886]: Jul 8, 2026, 12:30 PM
                    - generic [ref=e887]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e888]:
                  - generic [ref=e889]:
                    - button "Clone test case" [ref=e890]:
                      - img [ref=e891]
                    - button "Edit test case" [ref=e894]:
                      - img [ref=e895]
                    - button "Delete test case" [ref=e898]:
                      - img [ref=e899]
              - 'link "17 Record: xitester.com Recorded Add tags Ready to Record No Runs 1 Jul 8, 2026, 12:28 PM by ashid Clone test case Edit test case Delete test case" [ref=e902] [cursor=pointer]':
                - cell [ref=e903]:
                  - checkbox [ref=e904]
                - cell "17" [ref=e905]
                - 'cell "Record: xitester.com Recorded" [ref=e906]':
                  - generic [ref=e908]:
                    - generic [ref=e909]: "Record: xitester.com"
                    - generic [ref=e910]:
                      - img [ref=e911]
                      - text: Recorded
                - cell "Add tags" [ref=e914]:
                  - button "Add tags" [ref=e915]:
                    - generic [ref=e916]:
                      - img [ref=e917]
                      - text: Add tags
                - cell "Ready to Record" [ref=e920]:
                  - generic [ref=e921]: Ready to Record
                - cell "No Runs" [ref=e923]:
                  - generic [ref=e926]: No Runs
                - cell "1" [ref=e927]
                - cell "Jul 8, 2026, 12:28 PM by ashid" [ref=e928]:
                  - generic [ref=e929]:
                    - generic [ref=e930]: Jul 8, 2026, 12:28 PM
                    - generic [ref=e931]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e932]:
                  - generic [ref=e933]:
                    - button "Clone test case" [ref=e934]:
                      - img [ref=e935]
                    - button "Edit test case" [ref=e938]:
                      - img [ref=e939]
                    - button "Delete test case" [ref=e942]:
                      - img [ref=e943]
              - link "18 qa-src-1783513185751-wsq6 Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 12:19 PM by ashid Clone test case Edit test case Delete test case" [ref=e946] [cursor=pointer]:
                - cell [ref=e947]:
                  - checkbox [ref=e948]
                - cell "18" [ref=e949]
                - cell "qa-src-1783513185751-wsq6 Manual Source for clone" [ref=e950]:
                  - generic [ref=e951]:
                    - generic [ref=e952]:
                      - generic [ref=e953]: qa-src-1783513185751-wsq6
                      - generic [ref=e954]:
                        - img [ref=e955]
                        - text: Manual
                    - generic "Source for clone" [ref=e958]
                - cell "Add tags" [ref=e959]:
                  - button "Add tags" [ref=e960]:
                    - generic [ref=e961]:
                      - img [ref=e962]
                      - text: Add tags
                - cell "Idle" [ref=e965]:
                  - generic [ref=e966]: Idle
                - cell "No Runs" [ref=e968]:
                  - generic [ref=e971]: No Runs
                - cell "0" [ref=e972]
                - cell "Jul 8, 2026, 12:19 PM by ashid" [ref=e973]:
                  - generic [ref=e974]:
                    - generic [ref=e975]: Jul 8, 2026, 12:19 PM
                    - generic [ref=e976]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e977]:
                  - generic [ref=e978]:
                    - button "Clone test case" [ref=e979]:
                      - img [ref=e980]
                    - button "Edit test case" [ref=e983]:
                      - img [ref=e984]
                    - button "Delete test case" [ref=e987]:
                      - img [ref=e988]
              - link "19 qa-src-1783512683750-fbjb Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 12:11 PM by ashid Clone test case Edit test case Delete test case" [ref=e991] [cursor=pointer]:
                - cell [ref=e992]:
                  - checkbox [ref=e993]
                - cell "19" [ref=e994]
                - cell "qa-src-1783512683750-fbjb Manual Source for clone" [ref=e995]:
                  - generic [ref=e996]:
                    - generic [ref=e997]:
                      - generic [ref=e998]: qa-src-1783512683750-fbjb
                      - generic [ref=e999]:
                        - img [ref=e1000]
                        - text: Manual
                    - generic "Source for clone" [ref=e1003]
                - cell "Add tags" [ref=e1004]:
                  - button "Add tags" [ref=e1005]:
                    - generic [ref=e1006]:
                      - img [ref=e1007]
                      - text: Add tags
                - cell "Idle" [ref=e1010]:
                  - generic [ref=e1011]: Idle
                - cell "No Runs" [ref=e1013]:
                  - generic [ref=e1016]: No Runs
                - cell "0" [ref=e1017]
                - cell "Jul 8, 2026, 12:11 PM by ashid" [ref=e1018]:
                  - generic [ref=e1019]:
                    - generic [ref=e1020]: Jul 8, 2026, 12:11 PM
                    - generic [ref=e1021]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e1022]:
                  - generic [ref=e1023]:
                    - button "Clone test case" [ref=e1024]:
                      - img [ref=e1025]
                    - button "Edit test case" [ref=e1028]:
                      - img [ref=e1029]
                    - button "Delete test case" [ref=e1032]:
                      - img [ref=e1033]
              - link "20 qa-src-1783512650702-81bn Manual Source for clone Add tags Idle No Runs 0 Jul 8, 2026, 12:10 PM by ashid Clone test case Edit test case Delete test case" [ref=e1036] [cursor=pointer]:
                - cell [ref=e1037]:
                  - checkbox [ref=e1038]
                - cell "20" [ref=e1039]
                - cell "qa-src-1783512650702-81bn Manual Source for clone" [ref=e1040]:
                  - generic [ref=e1041]:
                    - generic [ref=e1042]:
                      - generic [ref=e1043]: qa-src-1783512650702-81bn
                      - generic [ref=e1044]:
                        - img [ref=e1045]
                        - text: Manual
                    - generic "Source for clone" [ref=e1048]
                - cell "Add tags" [ref=e1049]:
                  - button "Add tags" [ref=e1050]:
                    - generic [ref=e1051]:
                      - img [ref=e1052]
                      - text: Add tags
                - cell "Idle" [ref=e1055]:
                  - generic [ref=e1056]: Idle
                - cell "No Runs" [ref=e1058]:
                  - generic [ref=e1061]: No Runs
                - cell "0" [ref=e1062]
                - cell "Jul 8, 2026, 12:10 PM by ashid" [ref=e1063]:
                  - generic [ref=e1064]:
                    - generic [ref=e1065]: Jul 8, 2026, 12:10 PM
                    - generic [ref=e1066]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e1067]:
                  - generic [ref=e1068]:
                    - button "Clone test case" [ref=e1069]:
                      - img [ref=e1070]
                    - button "Edit test case" [ref=e1073]:
                      - img [ref=e1074]
                    - button "Delete test case" [ref=e1077]:
                      - img [ref=e1078]
          - generic [ref=e1083]:
            - generic [ref=e1084]: 1–20 of 418 test cases
            - generic [ref=e1085]:
              - generic [ref=e1086]:
                - generic [ref=e1087]: Rows per page
                - combobox [ref=e1088] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e1089]
              - generic [ref=e1091]:
                - generic [ref=e1092]: Page 1of21
                - generic [ref=e1093]:
                  - button "First page" [disabled]:
                    - img
                  - button "Previous page" [disabled]:
                    - img
                  - button "Next page" [ref=e1094] [cursor=pointer]:
                    - img [ref=e1095]
                  - button "Last page" [ref=e1097] [cursor=pointer]:
                    - img [ref=e1098]
```

# Test source

```ts
  335 |     await openNewTestCaseDropdown(page)
  336 |     await page.locator('button', { hasText: 'Record Test Case' }).click()
  337 | 
  338 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Record Test Case' })
  339 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  340 | 
  341 |     await dialog.locator('#recordTestName').fill(recordTestCaseName)
  342 |     await dialog.locator('#recordTestDescription').fill('Created by Playwright TC-069')
  343 |     await dialog.locator('#startUrl').fill('https://xitester.com')
  344 | 
  345 |     await dialog.locator('button[type="submit"]', { hasText: /Start Recording/ }).click()
  346 | 
  347 |     // SPA navigates to /test-analysis with state {mode:'record', startUrl, initialTitle}.
  348 |     await page.waitForURL(/\/test-analysis(\?|$|#|\/)/, { timeout: 10_000 })
  349 |     expect(page.url()).toMatch(/\/test-analysis/)
  350 |     await expect(page.getByText('Analysis Steps')).toBeVisible();
  351 |     await expect(page.getByText('https://xitester.com')).toBeVisible();
  352 |     await gotoTestCases(page)
  353 |     await expect(page.locator('input[placeholder="Search test cases…"]')).toBeVisible()
  354 |     await searchFor(page, recordTestCaseName)
  355 | 
  356 | })
  357 | 
  358 | test('TC-070 — Update an existing recorded test case', async ({ page }) => {
  359 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  360 |     // Recorded test cases are produced by the recording-browser flow, which
  361 |     // requires a remote container we deliberately don't drive in CI. So we
  362 |     // pick the first session in the list whose row carries the "Recorded"
  363 |     // badge. Skip cleanly when the project doesn't have one yet.
  364 | 
  365 |     await gotoTestCases(page)
  366 |     await expect(page.locator('input[placeholder="Search test cases…"]')).toBeVisible()
  367 |     await searchFor(page, recordTestCaseName)
  368 |     const recordedRow = page
  369 |         .locator('table tbody tr.test-case-row')
  370 |         .filter({ has: page.getByText(recordTestCaseName) })
  371 |         .filter({ has: page.getByText(/^Recorded$/) })
  372 |         .first()
  373 |     if (!(await recordedRow.isVisible().catch(() => false))) {
  374 |         test.skip(true, 'No recorded test case in this project yet — create one via the SUT first.')
  375 |     }
  376 | 
  377 |     // Capture the original title so we can revert in cleanup.
  378 |     const titleCell = recordedRow.locator('td').nth(2)
  379 |     const originalTitle = (await titleCell.locator('.font-medium').first().innerText()).trim()
  380 |     const renamed = `qa-rec-edit-${ts()}`
  381 | 
  382 |     await uiUpdateTestCase(page, recordedRow, renamed)
  383 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  384 |         /test case updated/i,
  385 |         { timeout: 5_000 },
  386 |     )
  387 |     await searchFor(page, renamed)
  388 |     await expect(testCaseRow(page, renamed)).toBeVisible({ timeout: 8_000 })
  389 | 
  390 |     // Revert so we leave the project as we found it.
  391 |     await uiUpdateTestCase(page, testCaseRow(page, renamed), originalTitle)
  392 |     await clearSearch(page)
  393 | })
  394 | 
  395 | test('TC-071 — Delete a recorded test case', async ({ page }) => {
  396 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  397 |     // Hard to safely delete a real recorded session (it may be load-bearing
  398 |     // for the user). Instead, find a recorded one named with our `qa-rec-*`
  399 |     // prefix from prior runs (orphans), and delete that. If none, skip.
  400 | 
  401 |     await gotoTestCases(page)
  402 |     await expect(page.locator('input[placeholder="Search test cases…"]')).toBeVisible()
  403 |     await searchFor(page, recordTestCaseName)
  404 |     const orphan = page
  405 |         .locator('table tbody tr.test-case-row')
  406 |         .filter({ has: page.getByText(recordTestCaseName) })
  407 |         .filter({ has: page.getByText(/^Recorded$/) })
  408 |         .first()
  409 |     if (!(await orphan.isVisible().catch(() => false))) {
  410 |         test.skip(true, 'No qa-rec-* recorded test case to delete — nothing to clean up.')
  411 |     }
  412 |     await uiDeleteTestCase(page, orphan)
  413 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  414 |         /test case deleted/i,
  415 |         { timeout: 5_000 },
  416 |     )
  417 |     await clearSearch(page)
  418 | })
  419 | 
  420 | test('TC-072 — Clone a recorded test case', async ({ page }) => {
  421 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  422 |     // Same constraint as TC-070: the project must already contain at least
  423 |     // one recorded test case. Skip if none.
  424 | 
  425 |     const name = `qa-rec-${ts()}`
  426 |     await gotoTestCases(page)
  427 |     await uiCreateRecordTestCase(page, name)
  428 |     await gotoTestCases(page)
  429 | 
  430 |     const recordedRow = page
  431 |         .locator('table tbody tr.test-case-row')
  432 |         .filter({ has: page.getByText(name, { exact: true }) })
  433 |         .filter({ has: page.getByText(/^Recorded$/) })
  434 |         .first()
> 435 |     await expect(recordedRow).toBeVisible({ timeout: 15000 })
      |                               ^ Error: expect(locator).toBeVisible() failed
  436 |     // if (!(await recordedRow.isVisible().catch(() => false))) {
  437 |     //     test.skip(true, 'No recorded test case in this project yet — create one via the SUT first.')
  438 |     // }
  439 | 
  440 |     const cloneName = `qa-rec-clone-${ts()}`
  441 |     await uiCloneTestCase(page, recordedRow, cloneName)
  442 |     await searchFor(page, cloneName)
  443 |     await expect(testCaseRow(page, cloneName)).toBeVisible({ timeout: 8_000 })
  444 | 
  445 |     // Cleanup.
  446 |     await uiDeleteTestCase(page, testCaseRow(page, cloneName))
  447 |     await clearSearch(page)
  448 | })
  449 | 
  450 | test('TC-073 — Search filters the list to matching test cases', async ({ page }) => {
  451 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  452 |     // Seed a uniquely-named test case so we know the search must surface
  453 |     // exactly one row regardless of the rest of the project's state.
  454 | 
  455 |     const unique = `qa-search-${ts()}`
  456 |     await uiCreateAITestCase(page, unique)
  457 | 
  458 |     await gotoTestCases(page)
  459 |     await searchFor(page, unique)
  460 | 
  461 |     // Exactly one matching row.
  462 |     const matchingRows = page.locator('table tbody tr.test-case-row')
  463 |     await expect.poll(async () => await matchingRows.count(), { timeout: 8_000 }).toBe(1)
  464 |     await expect(testCaseRow(page, unique)).toBeVisible()
  465 | 
  466 |     // Cleanup.
  467 |     await uiDeleteTestCase(page, testCaseRow(page, unique))
  468 | })
  469 | 
  470 | test('TC-074 — Add a tag to a test case', async ({ page }) => {
  471 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  472 | 
  473 |     const tcName = `qa-tag-${ts()}`
  474 |     const tagName = `pw-${ts()}`
  475 |     await uiCreateAITestCase(page, tcName)
  476 |     await gotoTestCases(page)
  477 |     await searchFor(page, tcName)
  478 |     const row = testCaseRow(page, tcName)
  479 |     await expect(row).toBeVisible({ timeout: 8_000 })
  480 | 
  481 |     // Click the tags cell to switch the row into edit mode. The cell's
  482 |     // button is the only `<button title="Click to edit tags">`.
  483 |     await row.locator('button[title="Click to edit tags"]').click()
  484 |     const tagInput = row.locator('input[role="combobox"]')
  485 |     await expect(tagInput).toBeVisible({ timeout: 5_000 })
  486 | 
  487 |     await tagInput.fill(tagName)
  488 |     // First creates the tag via POST /api/tags, then attaches it via
  489 |     // POST /api/tags/session/<id>. Wait for the attach call (the second one)
  490 |     // since it's the persistence boundary the assertion cares about.
  491 |     await Promise.all([
  492 |         page.waitForResponse(
  493 |             r => /\/api\/tags\/session\/[^/]+\b/.test(r.url()) && r.request().method() === 'POST',
  494 |             { timeout: 15_000 },
  495 |         ),
  496 |         tagInput.press('Enter'),
  497 |     ])
  498 | 
  499 |     // Tag chip should appear inside the row.
  500 |     await expect(row.getByText(tagName, { exact: true })).toBeVisible({ timeout: 5_000 })
  501 | 
  502 |     // Blur the tag editor by clicking the search input, then delete.
  503 |     await page.locator('input[placeholder="Search test cases…"]').click()
  504 |     await uiDeleteTestCase(page, testCaseRow(page, tcName))
  505 | })
  506 | 
  507 | test('TC-075 — Removing a tag persists after page reload', async ({ page }) => {
  508 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  509 | 
  510 |     const tcName = `qa-rmtag-${ts()}`
  511 |     const tagName = `rm-${ts()}`
  512 |     await uiCreateAITestCase(page, tcName)
  513 |     await gotoTestCases(page)
  514 |     await searchFor(page, tcName)
  515 |     const row = testCaseRow(page, tcName)
  516 |     await expect(row).toBeVisible({ timeout: 8_000 })
  517 | 
  518 |     // Add a tag first.
  519 |     await row.locator('button[title="Click to edit tags"]').click()
  520 |     const tagInput = row.locator('input[role="combobox"]')
  521 |     await tagInput.fill(tagName)
  522 |     await Promise.all([
  523 |         page.waitForResponse(
  524 |             r => /\/api\/tags\/session\/[^/]+\b/.test(r.url()) && r.request().method() === 'POST',
  525 |             { timeout: 15_000 },
  526 |         ),
  527 |         tagInput.press('Enter'),
  528 |     ])
  529 |     await expect(row.getByText(tagName, { exact: true })).toBeVisible({ timeout: 5_000 })
  530 | 
  531 |     // After the add settles, the row drifts back to read-only TagList mode
  532 |     // (the wrapper's onBlur handler runs after the async POST chain). Click
  533 |     // the search input to force that blur, then wait for the read-only
  534 |     // tags cell to become visible — that's the stable "we know which mode
  535 |     // we're in" handle.
```