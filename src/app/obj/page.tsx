'use client'
import { useState } from 'react'
import styles from './page.module.css'
import ModelViewer from '@/components/modelViewer'
import Link from 'next/link'

const PortfolioLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Mock data - replace with your actual items
  const items = [
    {
      id: 1,
      title: 'cloud tray',
      glbSrc: '/cloud.glb',
    },
    {
      id: 2,
      title: 'bulbasaur',
      glbSrc: '/bulbasaur.glb',
      href: '/obj/bulbasaur',
    },
    {
      id: 3,
      title: 'garden tray',
      glbSrc: '/garden.glb',
    },
    {
      id: 4,
      title: 'pool soap dish',
      glbSrc: '/pool.glb',
    },
    {
      id: 5,
      title: 'snake pot',
      glbSrc: '/snake.glb',
    },
    {
      id: 6,
      title: 'volcano incense chamber',
      glbSrc: '/volcano.glb',
    },
    {
      id: 7,
      title: 'foggy bridge',
      glbSrc: '/foggy-bridge.glb',
    },
    {
      id: 8,
      title: 'big brother',
      glbSrc: '/big-brother.glb',
    },
    {
      id: 9,
      title: 'little sister',
      glbSrc: '/little-sister.glb',
    },
  ]

  return (
    <div className={styles.mainContainer}>
      {/* Sidebar */}
      <div
        className={`${styles.sideColumn} ${isSidebarOpen ? styles.isOpen : ''}`}
      >
        <div className={styles.windowControls}>
          <div className={styles.closeButton}></div>
          <div className={styles.minimizeButton}></div>
          <div className={styles.expandButton}></div>
        </div>

        <div className={styles.navSection}>
          <div className={styles.sectionTitle}>Categories</div>
          <nav>
            <a href="#" className={styles.navLink}>
              <span className={styles.navIcon}></span>
              All Works
            </a>
            <a href="#" className={styles.navLink}>
              <span className={styles.navIcon}></span>
              Bowls
            </a>
            <a href="#" className={styles.navLink}>
              <span className={styles.navIcon}></span>
              Vases
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <Link
            href="/"
            className={`${styles['arrow-wrapper']} ${styles['no-back']}`}
          >
            <div className={styles['nav-back-arrow']}></div>
          </Link>
          <div className={`${styles['arrow-wrapper']} ${styles.next}`}>
            <div className={styles['nav-forward-arrow']}></div>
          </div>
          <strong></strong>
        </div>

        {/* Grid Content */}

        <div className={styles.gridContainer}>
          <div className={styles.itemsGrid}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <ModelViewer
                  glbSrc={item.glbSrc}
                  href={item.href}
                  alt={item.title}
                  title={item.title}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className={styles.bottomNav}>
          <div className={styles.navItem}>
            <img src="disc.png" className={styles.navItemIcon} alt="Icon" />
            <span>connorvoelk</span>
          </div>
          <div className={styles.navItem}>
            <img src="folder.png" className={styles.navItemIcon} alt="Icon" />
            <span>[obj]</span>
          </div>
          {/* <div className={styles.navItem}>
            <img
              src="/api/placeholder/16/16"
              className={styles.navItemIcon}
              alt="Icon"
            />
            <span>Works</span>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default PortfolioLayout
