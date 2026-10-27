import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

os.makedirs('screenshots', exist_ok=True)

chrome_options = Options()
chrome_options.add_argument('--headless=new')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--window-size=1440,900')

driver = webdriver.Chrome(options=chrome_options)

try:
    print("Navigating to landing page...")
    driver.get('http://localhost:3000/')
    time.sleep(2)
    driver.save_screenshot('screenshots/fig1_landing_page.png')
    print("Captured: fig1_landing_page.png")

    print("Navigating to login page...")
    driver.get('http://localhost:3000/login')
    time.sleep(1.5)
    
    # Click Demo Login button
    demo_buttons = driver.find_elements(By.TAG_NAME, 'button')
    clicked = False
    for btn in demo_buttons:
        if 'demo' in btn.text.lower():
            btn.click()
            clicked = True
            break
    
    if not clicked:
        # Fallback: inject localStorage directly
        driver.execute_script("""
            localStorage.setItem('tm_token', 'demo_token_admin');
            localStorage.setItem('tm_user', JSON.stringify({
                id: 1,
                name: 'Sarah Jenkins',
                email: 'recruiter@talentmatch.ai',
                role: 'Recruiter',
                company: 'TalentMatch AI Demo'
            }));
            window.location.href = '/dashboard';
        """)
    
    time.sleep(3)
    driver.save_screenshot('screenshots/fig2_dashboard.png')
    print("Captured: fig2_dashboard.png")

    # Navigate to Jobs
    driver.get('http://localhost:3000/jobs')
    time.sleep(2)
    driver.save_screenshot('screenshots/fig3_jobs.png')
    print("Captured: fig3_jobs.png")

    # Navigate to Resume Upload
    driver.get('http://localhost:3000/resumes/upload')
    time.sleep(2)
    driver.save_screenshot('screenshots/fig4_resume_upload.png')
    print("Captured: fig4_resume_upload.png")

    # Navigate to Candidates
    driver.get('http://localhost:3000/candidates')
    time.sleep(2)
    driver.save_screenshot('screenshots/fig5_candidates.png')
    print("Captured: fig5_candidates.png")

    # Navigate to Candidate Details
    driver.get('http://localhost:3000/candidates/cand_001')
    time.sleep(2)
    driver.save_screenshot('screenshots/fig6_candidate_details.png')
    print("Captured: fig6_candidate_details.png")

    # Navigate to Rankings
    driver.get('http://localhost:3000/rankings')
    time.sleep(2)
    driver.save_screenshot('screenshots/fig7_rankings.png')
    print("Captured: fig7_rankings.png")

    # Navigate to Analytics
    driver.get('http://localhost:3000/analytics')
    time.sleep(2)
    driver.save_screenshot('screenshots/fig8_analytics.png')
    print("Captured: fig8_analytics.png")

    # Navigate to Settings
    driver.get('http://localhost:3000/settings')
    time.sleep(2)
    driver.save_screenshot('screenshots/fig9_settings.png')
    print("Captured: fig9_settings.png")

    print("All screenshots successfully captured!")
finally:
    driver.quit()
